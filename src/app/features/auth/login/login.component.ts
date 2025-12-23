import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, HostListener, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import * as THREE from 'three';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  passwordFocused = false;
  usernameFocused = false;
  pupilX = 0;
  pupilY = 0;
  isWaving = false;
  isGreeting = true; // Estado especial de saludo que tiene prioridad
  robotMessage = '¡Hola! Bienvenido';
  displayedMessage = '';
  displayedChars: string[] = [];
  showBubble = false;
  private typingTimeout: any;

  // ========== TEMAS ESTACIONALES (automático por fecha) ==========
  // Navidad: 1 dic 12:00 - 25 dic 23:59
  // Año Nuevo: 26 dic 12:00 - 3 ene 23:59
  showChristmasHat = false;
  showNewYearTheme = false;

  // Contador de Año Nuevo
  countdownDays = 0;
  countdownHours = 0;
  countdownMinutes = 0;
  countdownSeconds = 0;
  isNewYearArrived = false; // true cuando ya es 1 de enero o después
  private countdownInterval: any;

  // Modo fullscreen del contador
  showFullscreenCountdown = false;

  // Getter para el año nuevo
  get newYear(): number {
    const now = new Date();
    // Si estamos en enero, es el año actual; si no, es el próximo
    return now.getMonth() === 0 ? now.getFullYear() : now.getFullYear() + 1;
  }
  // ================================================================

  // ========== THREE.JS - Árbol 3D Realista ==========
  @ViewChild('treeCanvas', { static: false }) treeCanvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId: number = 0;
  private ornaments: THREE.Mesh[] = [];
  private lights3D: THREE.PointLight[] = [];
  private snowParticles!: THREE.Points;
  private star!: THREE.Mesh;
  // ===================================================

  // ========== THREE.JS - Nieve Fullscreen ==========
  @ViewChild('snowCanvas', { static: false }) snowCanvasRef!: ElementRef<HTMLCanvasElement>;
  private snowRenderer!: THREE.WebGLRenderer;
  private snowScene!: THREE.Scene;
  private snowCamera!: THREE.PerspectiveCamera;
  private snowAnimationId: number = 0;
  private fullscreenSnow!: THREE.Points;
  // =================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private ngZone: NgZone
  ) {}

  /**
   * Detecta el tema estacional basado en la fecha actual
   * - Navidad: 1 dic 12:00 - 25 dic 23:59
   * - Año Nuevo: 26 dic 12:00 - 3 ene 23:59
   */
  private detectSeasonalTheme(): void {
    const now = new Date();
    const month = now.getMonth(); // 0-11 (0 = enero, 11 = diciembre)
    const day = now.getDate();
    const hour = now.getHours();

    // Navidad: 1 dic 12:00 - 25 dic 23:59
    // month === 11 es diciembre
    if (month === 11) {
      if ((day === 1 && hour >= 12) || (day > 1 && day <= 25)) {
        this.showChristmasHat = true;
        this.showNewYearTheme = false;
        return;
      }
      // Año Nuevo: 26 dic 12:00 - 31 dic 23:59
      if ((day === 26 && hour >= 12) || (day > 26 && day <= 31)) {
        this.showChristmasHat = false;
        this.showNewYearTheme = true;
        return;
      }
    }

    // Año Nuevo: 1 ene 00:00 - 3 ene 23:59
    // month === 0 es enero
    if (month === 0 && day >= 1 && day <= 3) {
      this.showChristmasHat = false;
      this.showNewYearTheme = true;
      return;
    }

    // Fuera de temporada
    this.showChristmasHat = false;
    this.showNewYearTheme = false;
  }

  /**
   * Inicia el contador regresivo para Año Nuevo
   */
  private startNewYearCountdown(): void {
    // Determinar el año objetivo (si estamos en enero, el año nuevo ya llegó)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Si estamos en enero (mes 0), ya llegó el año nuevo
    if (currentMonth === 0) {
      this.isNewYearArrived = true;
      return;
    }

    // Fecha objetivo: 1 de enero del próximo año a las 00:00:00
    const targetYear = currentYear + 1;
    const newYearDate = new Date(targetYear, 0, 1, 0, 0, 0);

    // Actualizar contador cada segundo
    this.updateCountdown(newYearDate);
    this.countdownInterval = setInterval(() => {
      this.updateCountdown(newYearDate);
    }, 1000);
  }

  /**
   * Actualiza los valores del contador
   */
  private updateCountdown(targetDate: Date): void {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      // ¡Llegó el Año Nuevo!
      this.isNewYearArrived = true;
      this.countdownDays = 0;
      this.countdownHours = 0;
      this.countdownMinutes = 0;
      this.countdownSeconds = 0;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }

    // Calcular días, horas, minutos, segundos
    this.countdownDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.countdownHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.countdownSeconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  ngOnInit(): void {
    // Detectar tema estacional por fecha
    this.detectSeasonalTheme();

    // Si es tema de Año Nuevo, iniciar el contador
    if (this.showNewYearTheme) {
      this.startNewYearCountdown();
    }

    // Initialize form first
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Resetear estados al iniciar
    this.showBubble = false;
    this.isGreeting = true;
    this.isWaving = false;
    this.robotMessage = '¡Hola! Bienvenido';
    this.displayedMessage = '';
    this.displayedChars = [];

    // Iniciar animación de saludo después de que aparece el robot
    setTimeout(() => {
      this.showBubble = true;
      this.typeMessage(this.robotMessage); // Animar el mensaje inicial
      this.isWaving = true;
      // Terminar el saludo después de 2.5 segundos
      setTimeout(() => {
        this.isWaving = false;
        // Finalizar el estado de saludo para permitir que el robot reaccione al formulario
        setTimeout(() => {
          this.isGreeting = false;
          this.updateRobotMessage();
        }, 500); // Pequeño delay para transición suave
      }, 2500);
    }, 1000);

    // Escuchar cambios en el formulario para actualizar el mensaje del robot
    this.loginForm.valueChanges.subscribe(() => {
      if (!this.isGreeting) {
        this.updateRobotMessage();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar intervalos
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    // Limpiar Three.js - Árbol
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    // Limpiar Three.js - Nieve fullscreen
    if (this.snowAnimationId) {
      cancelAnimationFrame(this.snowAnimationId);
    }
    if (this.snowRenderer) {
      this.snowRenderer.dispose();
    }
  }

  // ========== THREE.JS - Inicialización del Árbol 3D ==========
  private initThreeJS(): void {
    if (!this.treeCanvasRef || !this.showChristmasHat) return;

    const canvas = this.treeCanvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 600;

    // Escena
    this.scene = new THREE.Scene();

    // Cámara
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 1.5, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Luces ambientales
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(ambientLight);

    // Luz direccional principal (simula luz de ventana)
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // Crear el árbol
    this.createTree();

    // Crear ornamentos
    this.createOrnaments();

    // Crear luces del árbol
    this.createTreeLights();

    // Crear estrella
    this.createStar();

    // Crear nieve
    this.createSnow();

    // Iniciar animación
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private createTree(): void {
    // Material del árbol con textura de pino
    const treeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a5c2e,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: false
    });

    // Crear múltiples capas de conos para el árbol
    const layers = [
      { radius: 0.4, height: 0.8, y: 3.2 },
      { radius: 0.7, height: 1.0, y: 2.6 },
      { radius: 1.0, height: 1.2, y: 1.8 },
      { radius: 1.3, height: 1.4, y: 0.9 },
      { radius: 1.6, height: 1.5, y: 0.0 }
    ];

    layers.forEach((layer, index) => {
      const geometry = new THREE.ConeGeometry(layer.radius, layer.height, 32);
      const mesh = new THREE.Mesh(geometry, treeMaterial.clone());

      // Variar el color ligeramente por capa
      const hue = 0.35 + (index * 0.02);
      const saturation = 0.7 - (index * 0.05);
      const lightness = 0.25 + (index * 0.03);
      (mesh.material as THREE.MeshStandardMaterial).color.setHSL(hue, saturation, lightness);

      mesh.position.y = layer.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });

    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 16);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2810,
      roughness: 0.9,
      metalness: 0.0
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -0.55;
    trunk.castShadow = true;
    this.scene.add(trunk);

    // Base/Maceta
    const potGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.4, 16);
    const potMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B0000,
      roughness: 0.6,
      metalness: 0.2
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -1.0;
    pot.castShadow = true;
    this.scene.add(pot);
  }

  private createOrnaments(): void {
    const ornamentPositions = [
      // Capa superior
      { x: 0.25, y: 2.9, z: 0.2, color: 0xff0000, size: 0.08 },
      { x: -0.2, y: 2.7, z: 0.25, color: 0xffd700, size: 0.08 },
      // Segunda capa
      { x: 0.5, y: 2.3, z: 0.3, color: 0xc0c0c0, size: 0.1 },
      { x: -0.4, y: 2.1, z: 0.4, color: 0xff0000, size: 0.1 },
      { x: 0.1, y: 2.0, z: 0.5, color: 0xffd700, size: 0.09 },
      // Tercera capa
      { x: 0.7, y: 1.5, z: 0.4, color: 0xff0000, size: 0.12 },
      { x: -0.6, y: 1.6, z: 0.5, color: 0xc0c0c0, size: 0.11 },
      { x: 0.3, y: 1.4, z: 0.7, color: 0xffd700, size: 0.1 },
      { x: -0.2, y: 1.3, z: 0.6, color: 0xff0000, size: 0.12 },
      // Cuarta capa
      { x: 0.9, y: 0.8, z: 0.5, color: 0xffd700, size: 0.13 },
      { x: -0.8, y: 0.9, z: 0.6, color: 0xff0000, size: 0.12 },
      { x: 0.5, y: 0.7, z: 0.9, color: 0xc0c0c0, size: 0.13 },
      { x: -0.4, y: 0.6, z: 0.8, color: 0xffd700, size: 0.11 },
      // Capa base
      { x: 1.1, y: 0.2, z: 0.6, color: 0xff0000, size: 0.14 },
      { x: -1.0, y: 0.3, z: 0.7, color: 0xc0c0c0, size: 0.13 },
      { x: 0.7, y: 0.1, z: 1.0, color: 0xffd700, size: 0.14 },
      { x: -0.5, y: 0.0, z: 1.1, color: 0xff0000, size: 0.12 }
    ];

    ornamentPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: pos.color,
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1
      });
      const ornament = new THREE.Mesh(geometry, material);
      ornament.position.set(pos.x, pos.y, pos.z);
      ornament.castShadow = true;
      this.ornaments.push(ornament);
      this.scene.add(ornament);
    });
  }

  private createTreeLights(): void {
    const lightPositions = [
      { x: 0.3, y: 3.0, z: 0.15 },
      { x: -0.35, y: 2.5, z: 0.3 },
      { x: 0.55, y: 2.0, z: 0.45 },
      { x: -0.5, y: 1.5, z: 0.55 },
      { x: 0.75, y: 1.0, z: 0.65 },
      { x: -0.7, y: 0.5, z: 0.75 },
      { x: 0.95, y: 0.2, z: 0.85 },
      { x: -0.9, y: 0.0, z: 0.9 }
    ];

    lightPositions.forEach((pos, index) => {
      // Punto de luz
      const light = new THREE.PointLight(0xffdd44, 0.5, 2);
      light.position.set(pos.x, pos.y, pos.z);
      this.lights3D.push(light);
      this.scene.add(light);

      // Esfera brillante para visualizar la luz
      const bulbGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const bulbMaterial = new THREE.MeshBasicMaterial({
        color: 0xffee88,
        transparent: true,
        opacity: 0.9
      });
      const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
      bulb.position.copy(light.position);
      this.scene.add(bulb);
    });
  }

  private createStar(): void {
    // Crear forma de estrella
    const starShape = new THREE.Shape();
    const outerRadius = 0.25;
    const innerRadius = 0.1;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        starShape.moveTo(x, y);
      } else {
        starShape.lineTo(x, y);
      }
    }
    starShape.closePath();

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    };

    const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0xffaa00,
      emissiveIntensity: 0.5
    });

    this.star = new THREE.Mesh(starGeometry, starMaterial);
    this.star.position.set(0, 3.7, 0);
    this.star.rotation.x = -0.2;
    this.scene.add(this.star);

    // Luz de la estrella
    const starLight = new THREE.PointLight(0xffdd00, 1, 3);
    starLight.position.set(0, 3.7, 0.2);
    this.scene.add(starLight);
  }

  private createSnow(): void {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.snowParticles = new THREE.Points(geometry, material);
    this.scene.add(this.snowParticles);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Animar ornamentos (sutil balanceo)
    this.ornaments.forEach((ornament, index) => {
      ornament.position.y += Math.sin(time * 2 + index) * 0.0005;
    });

    // Animar luces (parpadeo)
    this.lights3D.forEach((light, index) => {
      light.intensity = 0.3 + Math.sin(time * 3 + index * 0.5) * 0.3;
    });

    // Animar estrella (rotación y brillo)
    if (this.star) {
      this.star.rotation.z = Math.sin(time * 0.5) * 0.1;
      (this.star.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(time * 2) * 0.2;
    }

    // Animar nieve (caída)
    if (this.snowParticles) {
      const positions = this.snowParticles.geometry.attributes['position'].array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02; // Velocidad de caída
        positions[i] += Math.sin(time + i) * 0.002; // Movimiento lateral

        // Reiniciar partículas que caen muy abajo
        if (positions[i + 1] < -2) {
          positions[i + 1] = 8;
          positions[i] = (Math.random() - 0.5) * 8;
        }
      }
      this.snowParticles.geometry.attributes['position'].needsUpdate = true;
    }

    // Rotar ligeramente la cámara
    this.camera.position.x = Math.sin(time * 0.2) * 0.3;

    this.renderer.render(this.scene, this.camera);
  }
  // ================================================================

  // ========== THREE.JS - Nieve Fullscreen ==========
  private initFullscreenSnow(): void {
    if (!this.snowCanvasRef || !this.showChristmasHat) return;

    const canvas = this.snowCanvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Escena
    this.snowScene = new THREE.Scene();

    // Cámara ortográfica para efecto 2D
    this.snowCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.snowCamera.position.z = 5;

    // Renderer
    this.snowRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.snowRenderer.setSize(width, height);
    this.snowRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.snowRenderer.setClearColor(0x000000, 0);

    // Crear partículas de nieve
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;     // X: ancho de pantalla
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y: alto de pantalla
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z: profundidad
      velocities[i] = 0.01 + Math.random() * 0.02;       // Velocidad individual
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.fullscreenSnow = new THREE.Points(geometry, material);
    this.snowScene.add(this.fullscreenSnow);

    // Listener para resize
    window.addEventListener('resize', () => this.onSnowResize());

    // Iniciar animación
    this.ngZone.runOutsideAngular(() => {
      this.animateFullscreenSnow();
    });
  }

  private onSnowResize(): void {
    if (!this.snowRenderer || !this.snowCamera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.snowCamera.aspect = width / height;
    this.snowCamera.updateProjectionMatrix();
    this.snowRenderer.setSize(width, height);
  }

  private animateFullscreenSnow(): void {
    this.snowAnimationId = requestAnimationFrame(() => this.animateFullscreenSnow());

    if (!this.fullscreenSnow) return;

    const positions = this.fullscreenSnow.geometry.attributes['position'].array as Float32Array;
    const velocities = this.fullscreenSnow.geometry.attributes['velocity'].array as Float32Array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;
      // Caída con velocidad individual
      positions[i + 1] -= velocities[idx];
      // Movimiento lateral suave (viento)
      positions[i] += Math.sin(time + idx * 0.1) * 0.003;

      // Reiniciar partículas que caen abajo
      if (positions[i + 1] < -8) {
        positions[i + 1] = 8;
        positions[i] = (Math.random() - 0.5) * 20;
      }
    }
    this.fullscreenSnow.geometry.attributes['position'].needsUpdate = true;

    // Rotación muy sutil
    this.fullscreenSnow.rotation.y = Math.sin(time * 0.1) * 0.05;

    this.snowRenderer.render(this.snowScene, this.snowCamera);
  }
  // =================================================

  private updateRobotMessage(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    let newMessage = '';

    if (this.loginForm.valid) {
      newMessage = '¡Perfecto! Todo listo';
    } else if (!username && !password) {
      newMessage = 'Ingresa tus credenciales';
    } else if (!username) {
      newMessage = 'Falta tu usuario';
    } else if (username.length < 3) {
      newMessage = 'Usuario muy corto';
    } else if (!password) {
      newMessage = 'Falta tu contraseña';
    } else if (password.length < 6) {
      newMessage = 'Contraseña muy corta';
    } else {
      newMessage = 'Revisa los campos';
    }

    // Solo animar si el mensaje cambió
    if (newMessage !== this.robotMessage) {
      this.robotMessage = newMessage;
      this.typeMessage(newMessage);
    }
  }

  private typeMessage(message: string): void {
    // Cancelar cualquier animación en progreso
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Limpiar el array
    this.displayedChars = [];

    // Convertir el mensaje en array de caracteres
    const chars = message.split('');
    let index = 0;

    const typeNextChar = () => {
      if (index < chars.length) {
        // Crear un nuevo array con el siguiente carácter
        this.displayedChars = chars.slice(0, index + 1);
        index++;
        this.typingTimeout = setTimeout(typeNextChar, 50); // 50ms por letra
      }
    };

    // Iniciar inmediatamente
    typeNextChar();
  }

  ngAfterViewInit(): void {
    // Usar polling continuo para detectar autocompletado
    this.startAutofillPolling();

    // Inicializar Three.js para el árbol 3D y nieve fullscreen (solo en Navidad)
    if (this.showChristmasHat) {
      setTimeout(() => {
        this.initThreeJS();
        this.initFullscreenSnow();
      }, 100);
    }
  }

  private startAutofillPolling(): void {
    // Revisar cada 100ms si los inputs tienen valores del autocompletado
    const pollingInterval = setInterval(() => {
      const usernameInput = this.elementRef.nativeElement.querySelector('#username') as HTMLInputElement;
      const passwordInput = this.elementRef.nativeElement.querySelector('#password') as HTMLInputElement;

      if (usernameInput && passwordInput) {
        const hasUsername = usernameInput.value && usernameInput.value.length > 0;
        const hasPassword = passwordInput.value && passwordInput.value.length > 0;

        // Si ambos campos tienen valores pero el formulario no los refleja
        if (hasUsername && hasPassword) {
          const formUsername = this.loginForm.get('username')?.value;
          const formPassword = this.loginForm.get('password')?.value;

          // Solo actualizar si el formulario no tiene los valores
          if (!formUsername || !formPassword ||
              formUsername !== usernameInput.value ||
              formPassword !== passwordInput.value) {

            // Actualizar el formulario
            this.loginForm.patchValue({
              username: usernameInput.value,
              password: passwordInput.value
            });

            // Forzar validación
            this.loginForm.updateValueAndValidity();
          }

          // Si el formulario ya está válido, detener el polling
          if (this.loginForm.valid) {
            clearInterval(pollingInterval);
          }
        }
      }
    }, 100);

    // Detener el polling después de 10 segundos para evitar uso excesivo de recursos
    setTimeout(() => {
      clearInterval(pollingInterval);
    }, 10000);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirect based on user role
        const user = this.authService.getCurrentUser();

        if (user?.role === 'ADMIN') {
          this.router.navigate(['/admin/monitoring']);
        } else if (user?.role === 'SUPERVISOR') {
          this.router.navigate(['/reports/contact']);
        } else if (user?.role === 'AGENT') {
          // Primero ir al dashboard de estados, desde ahí puede acceder a WhatsApp o Softphone
          this.router.navigate(['/agent-dashboard']);
        } else {
          this.router.navigate(['/dialer']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid username or password';
        console.error('Login error:', error);
      }
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onUsernameFocus(): void {
    this.usernameFocused = true;
    // Mirar hacia el campo de usuario (abajo-izquierda)
    this.pupilX = -1;
    this.pupilY = 2;
  }

  onUsernameBlur(): void {
    this.usernameFocused = false;
    this.pupilY = 0;
    this.pupilX = 0;
  }

  onUsernameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const length = input.value.length;
    // Mover las pupilas mientras escribe (simular lectura de izquierda a derecha)
    // Pero mantener la mirada hacia abajo
    const maxX = 1.5;
    this.pupilX = -1 + Math.min(length * 0.15, maxX);
    this.pupilY = 2;
  }

  onPasswordFocus(): void {
    this.passwordFocused = true;
    console.log('Password focused. isGreeting:', this.isGreeting, 'hidePassword:', this.hidePassword, 'passwordFocused:', this.passwordFocused);
    // Mirar hacia el campo de contraseña (más abajo)
    this.pupilX = -1;
    this.pupilY = 2.5;
  }

  onPasswordBlur(): void {
    this.passwordFocused = false;
    this.pupilY = 0;
    this.pupilX = 0;
  }

  getPupilTransform(): string {
    // Mantener centrado y luego aplicar el offset
    return `translate(calc(-50% + ${this.pupilX}px), calc(-50% + ${this.pupilY}px))`;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Abrir contador fullscreen
  openFullscreenCountdown(): void {
    this.showFullscreenCountdown = true;
    document.body.style.overflow = 'hidden';
  }

  // Cerrar contador fullscreen
  closeFullscreenCountdown(): void {
    this.showFullscreenCountdown = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Solo seguir el mouse si no está enfocado en ningún input
    if (this.usernameFocused || this.passwordFocused) {
      return;
    }

    const mascotElement = this.elementRef.nativeElement.querySelector('.mascot-head');
    if (!mascotElement) {
      return;
    }

    const rect = mascotElement.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    // Calcular vector entre el centro de la mascota y el mouse
    const deltaX = event.clientX - mascotCenterX;
    const deltaY = event.clientY - mascotCenterY;

    // Calcular distancia total
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limitar el movimiento de las pupilas (máximo 5.5px desde el centro)
    const maxDistance = 5.5;

    if (distance > 0) {
      // Normalizar el vector y multiplicar por la distancia máxima
      const factor = Math.min(distance / 60, 1); // Mayor sensibilidad
      this.pupilX = (deltaX / distance) * factor * maxDistance;
      this.pupilY = (deltaY / distance) * factor * maxDistance;
    } else {
      this.pupilX = 0;
      this.pupilY = 0;
    }
  }
}
