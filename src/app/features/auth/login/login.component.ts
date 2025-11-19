import { Component, OnInit, AfterViewInit, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

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
export class LoginComponent implements OnInit, AfterViewInit {
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
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
