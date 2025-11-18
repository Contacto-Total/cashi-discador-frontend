import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, HostListener, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Message, Chat } from '../../../../../core/models/message.model';
import { MessageService } from '../../../../../core/services/whatsapp/message.service';
import { ApiService } from '../../../../../core/services/whatsapp/api.service';
import { LucideAngularModule } from 'lucide-angular';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    LucideAngularModule,
    PickerComponent
  ],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindow implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentChat: Chat | null = null;
  messages: Message[] = [];
  reversedMessages: Message[] = []; // Array pre-invertido para el template
  messageText: string = '';
  private shouldScroll = false;
  messagesLoading = false;
  private mediaSrcCache = new Map<string, string>(); // Cache de URLs de media

  // Reply state
  replyingTo: Message | null = null;

  // Emoji picker state
  showEmojiPicker = false;
  emojiPickerI18n = {
    search: 'Buscar',
    notfound: 'No se encontraron emojis',
    categories: {
      search: 'Resultados de búsqueda',
      recent: 'Usados frecuentemente',
      people: 'Emoticonos y personas',
      nature: 'Animales y naturaleza',
      foods: 'Comida y bebida',
      activity: 'Actividades',
      places: 'Viajes y lugares',
      objects: 'Objetos',
      symbols: 'Símbolos',
      flags: 'Banderas',
      custom: 'Personalizados'
    }
  };

  // Search messages state
  showSearchBar = false;
  searchQuery = '';
  searchResults: Message[] = [];
  currentSearchIndex = 0;

  // Audio player state
  private audioStates: Map<string, {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    speed: number;
  }> = new Map();

  // Window status state
  windowStatus: any = null;
  isChatBlocked: boolean = false;
  isNewChat: boolean = false;
  hoursRemaining: number = 0;
  minutesRemaining: number = 0;
  secondsRemaining: number = 0;
  private windowCheckInterval: any;
  private countdownInterval: any;

  // Audio recording state
  isRecording = false;
  recordingTime = 0;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingTimer: any = null;
  private audioStream: MediaStream | null = null;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  // Formatear nombre del chat
  getChatDisplayName(): string {
    if (!this.currentChat) return '';

    if (!this.currentChat.name || this.currentChat.name.includes('@s.whatsapp.net')) {
      return this.formatPhoneNumber(this.currentChat.jid);
    }
    return this.currentChat.name;
  }

  // Formatear número de teléfono
  private formatPhoneNumber(jid: string): string {
    const phone = jid.split('@')[0];

    if (!/^\d+$/.test(phone)) {
      return jid;
    }

    if (phone.length >= 11) {
      const countryCode = phone.substring(0, 2);
      const rest = phone.substring(2);
      const formatted = rest.match(/.{1,3}/g)?.join(' ') || rest;
      return `+${countryCode} ${formatted}`;
    } else if (phone.length >= 10) {
      const countryCode = phone.substring(0, 1);
      const rest = phone.substring(1);
      const formatted = rest.match(/.{1,3}/g)?.join(' ') || rest;
      return `+${countryCode} ${formatted}`;
    } else {
      return `+${phone}`;
    }
  }

  ngOnInit(): void {
    this.messageService.currentChat$.subscribe(chat => {
      this.currentChat = chat;

      // Verificar estado de ventana cuando cambia el chat
      if (chat) {
        this.messagesLoading = true; // Mostrar loading al cambiar de chat
        this.checkWindowStatus();
        this.startWindowCheck();
      } else {
        this.stopWindowCheck();
      }
    });

    this.messageService.currentMessages$.subscribe(messages => {
      console.log('📬 Mensajes recibidos:', messages);
      const previousLength = this.messages.length;
      const isNewChatLoad = previousLength === 0 && messages.length > 0;

      this.messages = messages;
      // OPTIMIZACIÓN: Invertir array UNA SOLA VEZ aquí, no en el template
      this.reversedMessages = [...messages].reverse();

      this.checkIfNewChat();

      // Mostrar loading solo al cambiar de chat
      if (isNewChatLoad) {
        this.messagesLoading = true;
        this.shouldScroll = true;

        // Esperar a que el DOM esté listo
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.messagesLoading = false;
            this.cdr.markForCheck(); // Marcar para detección de cambios con OnPush
          });
        });
      }

      // Si llegó un mensaje nuevo del cliente, verificar estado de ventana
      if (messages.length > previousLength) {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage.fromMe) {
          console.log('💬 Mensaje nuevo del cliente - Verificando estado de ventana');
          setTimeout(() => {
            this.checkWindowStatus();
          }, 1000);
        }
      }
    });

    // Escuchar actualizaciones de estado de ventana en tiempo real
    this.messageService.windowStatusUpdate$.subscribe(update => {
      if (!update || !this.currentChat) return;

      // Si la actualización es para el chat actual
      if (update.chat === this.currentChat.jid || update.jid === this.currentChat.jid) {
        console.log('🔔 Actualización de ventana en tiempo real:', update);

        // Actualizar estado inmediatamente
        if (update.isBlocked !== undefined) {
          this.isChatBlocked = update.isBlocked;
          this.cdr.markForCheck();
        }

        if (update.hoursRemaining !== undefined) {
          this.hoursRemaining = update.hoursRemaining;
          this.cdr.markForCheck();
        }

        if (update.minutesRemaining !== undefined) {
          this.minutesRemaining = update.minutesRemaining;
        }

        // Recalcular countdown
        const totalSeconds = (this.hoursRemaining * 3600) + (this.minutesRemaining * 60);
        this.secondsRemaining = totalSeconds;

        // Reiniciar countdown si hay tiempo
        if (totalSeconds > 0 && !this.isChatBlocked) {
          this.startCountdown();
        } else {
          this.stopCountdown();
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    // Con column-reverse + array invertido, scroll natural está en posición correcta
    this.shouldScroll = false;
  }

  ngOnDestroy(): void {
    this.stopWindowCheck();
    this.stopCountdown();
    this.cleanupRecording();
  }

  // Verificar estado de ventana de respuesta
  checkWindowStatus(): void {
    if (!this.currentChat) return;

    this.apiService.getWindowStatus(this.currentChat.jid).subscribe({
      next: (status) => {
        this.windowStatus = status;
        this.isChatBlocked = status.isBlocked || false;
        this.hoursRemaining = status.hoursRemaining || 0;
        this.minutesRemaining = status.minutesRemaining || 0;

        // Calcular segundos totales para countdown
        const totalSeconds = (this.hoursRemaining * 3600) + (this.minutesRemaining * 60);
        this.secondsRemaining = totalSeconds;

        console.log('🔍 Window status:', {
          blocked: this.isChatBlocked,
          hours: this.hoursRemaining,
          minutes: this.minutesRemaining,
          seconds: this.secondsRemaining
        });

        // Iniciar countdown si hay ventana activa y no está bloqueado
        if (status.hasActiveWindow && !this.isChatBlocked && totalSeconds > 0) {
          this.startCountdown();
        } else {
          this.stopCountdown();
        }
      },
      error: (err) => {
        // Silenciar errores para no bloquear la UI
        // Si hay error, asumir que NO está bloqueado
        this.isChatBlocked = false;
        this.windowStatus = null;
        this.hoursRemaining = 0;
        this.minutesRemaining = 0;
        this.secondsRemaining = 0;
        this.stopCountdown();
      }
    });
  }

  // Verificar si es un chat nuevo (el cliente debe escribir primero)
  checkIfNewChat(): void {
    if (!this.messages || this.messages.length === 0) {
      // No hay mensajes = chat nuevo
      this.isNewChat = true;
      console.log('💬 Chat nuevo detectado - Cliente debe iniciar conversación');
      return;
    }

    // Verificar si hay algún mensaje del cliente (fromMe = false)
    const hasClientMessage = this.messages.some(msg => !msg.fromMe);

    if (!hasClientMessage) {
      // Solo hay mensajes del agente = chat nuevo aún
      this.isNewChat = true;
      console.log('💬 Chat sin mensajes del cliente - Cliente debe iniciar conversación');
    } else {
      this.isNewChat = false;
    }
  }

  // Iniciar verificación periódica cada 30 segundos
  startWindowCheck(): void {
    this.stopWindowCheck();
    this.windowCheckInterval = setInterval(() => {
      this.checkWindowStatus();
    }, 30000); // 30 segundos
  }

  // Detener verificación periódica
  stopWindowCheck(): void {
    if (this.windowCheckInterval) {
      clearInterval(this.windowCheckInterval);
      this.windowCheckInterval = null;
    }
  }

  // Iniciar countdown en tiempo real
  startCountdown(): void {
    this.stopCountdown();

    this.countdownInterval = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;

        // Actualizar horas y minutos
        this.hoursRemaining = Math.floor(this.secondsRemaining / 3600);
        this.minutesRemaining = Math.floor((this.secondsRemaining % 3600) / 60);

        // OPTIMIZACIÓN: Marcar para detección de cambios con OnPush
        this.cdr.markForCheck();
      } else {
        // Tiempo agotado - bloquear chat automáticamente
        console.log('⏰ Tiempo agotado - Bloqueando chat');
        this.isChatBlocked = true;
        this.windowStatus = { ...this.windowStatus, isBlocked: true, hasActiveWindow: false };
        this.stopCountdown();
        this.cdr.markForCheck();
      }
    }, 1000); // Cada segundo
  }

  // Detener countdown
  stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  sendMessage(): void {
    if (!this.currentChat || !this.messageText.trim()) return;

    // TEMPORALMENTE DESACTIVADO - Validación de bloqueo
    // if (this.isChatBlocked) {
    //   this.snackBar.open(
    //     '🚫 No puedes enviar mensajes a este chat. Espera a que el cliente te escriba de nuevo.',
    //     'Cerrar',
    //     {
    //       duration: 5000,
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       panelClass: ['error-snackbar']
    //     }
    //   );
    //   return;
    // }

    if (this.replyingTo) {
      // Enviar con reply
      this.messageService.sendMessage(
        this.currentChat.jid,
        this.messageText.trim(),
        this.replyingTo.msgId
      );
      this.replyingTo = null;
    } else {
      // Enviar normal
      this.messageService.sendMessage(this.currentChat.jid, this.messageText.trim());
    }
    this.messageText = '';

    // Verificar estado de ventana después de enviar (se reinicia la ventana)
    setTimeout(() => {
      this.checkWindowStatus();
    }, 1000);
  }

  // Reply methods
  replyToMessage(message: Message): void {
    this.replyingTo = message;
  }

  cancelReply(): void {
    this.replyingTo = null;
  }

  // Emoji picker methods
  toggleEmojiPicker(event: Event): void {
    event.stopPropagation();
    this.showEmojiPicker = !this.showEmojiPicker;
    this.cdr.markForCheck();
  }

  addEmoji(event: any): void {
    const emoji = event.emoji.native;
    this.messageText += emoji;
    this.showEmojiPicker = false;
    this.cdr.markForCheck();
  }

  closeEmojiPicker(): void {
    if (this.showEmojiPicker) {
      this.showEmojiPicker = false;
      this.cdr.markForCheck();
    }
  }

  // Search messages methods
  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchQuery = '';
      this.searchResults = [];
      this.currentSearchIndex = 0;
    }
    this.cdr.markForCheck();
  }

  searchMessages(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.currentSearchIndex = 0;
      this.cdr.markForCheck();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.searchResults = this.messages.filter(msg =>
      msg.text?.toLowerCase().includes(query)
    );
    this.currentSearchIndex = 0;
    this.cdr.markForCheck();

    // Scroll to first result
    if (this.searchResults.length > 0) {
      this.scrollToMessage(this.searchResults[0].msgId);
    }
  }

  nextSearchResult(): void {
    if (this.searchResults.length === 0) return;
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length;
    this.scrollToMessage(this.searchResults[this.currentSearchIndex].msgId);
    this.cdr.markForCheck();
  }

  previousSearchResult(): void {
    if (this.searchResults.length === 0) return;
    this.currentSearchIndex = this.currentSearchIndex === 0
      ? this.searchResults.length - 1
      : this.currentSearchIndex - 1;
    this.scrollToMessage(this.searchResults[this.currentSearchIndex].msgId);
    this.cdr.markForCheck();
  }

  private scrollToMessage(msgId: string): void {
    setTimeout(() => {
      const element = document.getElementById(`msg-${msgId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-message');
        setTimeout(() => element.classList.remove('highlight-message'), 2000);
      }
    }, 100);
  }

  isMessageHighlighted(msgId: string): boolean {
    return this.searchResults.length > 0 &&
           this.searchResults[this.currentSearchIndex]?.msgId === msgId;
  }

  // Audio recording methods
  async startRecording(): Promise<void> {
    if (this.isRecording || this.isChatBlocked || this.isNewChat) return;

    try {
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create media recorder
      const options = { mimeType: 'audio/webm;codecs=opus' };
      this.mediaRecorder = new MediaRecorder(this.audioStream, options);
      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingTime = 0;

      // Start timer
      this.recordingTimer = setInterval(() => {
        this.ngZone.run(() => {
          this.recordingTime++;
          this.cdr.markForCheck();
        });
      }, 1000);

      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error starting audio recording:', error);
      this.snackBar.open(
        'No se pudo acceder al micrófono. Por favor verifica los permisos.',
        'Cerrar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );
    }
  }

  stopRecording(): void {
    if (!this.isRecording || !this.mediaRecorder) return;

    this.mediaRecorder.onstop = () => {
      // Create blob from chunks
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

      // Convert to base64 and send
      this.sendAudioRecording(audioBlob);

      // Cleanup
      this.cleanupRecording();
    };

    this.mediaRecorder.stop();
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  cancelRecording(): void {
    if (!this.isRecording) return;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.cleanupRecording();
    this.cdr.markForCheck();
  }

  private cleanupRecording(): void {
    this.isRecording = false;
    this.recordingTime = 0;
    this.audioChunks = [];

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    this.mediaRecorder = null;
    this.cdr.markForCheck();
  }

  private async sendAudioRecording(audioBlob: Blob): Promise<void> {
    if (!this.currentChat) return;

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];

        // Send audio via message service
        this.messageService.sendMedia(
          this.currentChat!.jid,
          base64,
          'audio/webm',
          undefined
        );

        this.snackBar.open(
          '🎤 Audio enviado',
          '',
          {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error sending audio recording:', error);
      this.snackBar.open(
        'Error al enviar el audio',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );
    }
  }

  getRecordingTime(): string {
    const minutes = Math.floor(this.recordingTime / 60);
    const seconds = this.recordingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getWaveformBarHeight(index: number): number {
    // Generate pseudo-random but consistent heights for waveform bars
    const heights = [40, 65, 85, 55, 70, 45, 90, 60, 75, 50, 80, 55, 65, 70, 85, 60, 75, 50, 90, 65, 70, 55, 80, 60, 75, 50, 85, 65, 70, 55];
    return heights[index] || 60;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onEscapePressed(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.showEmojiPicker) {
        this.closeEmojiPicker();
      } else if (this.currentChat) {
        event.preventDefault();
        this.messageService.selectChat(null);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.closeEmojiPicker();
  }

  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.currentChat) return;

    // TEMPORALMENTE DESACTIVADO - Validación de bloqueo
    // if (this.isChatBlocked) {
    //   this.snackBar.open(
    //     '🚫 No puedes enviar archivos a este chat. Espera a que el cliente te escriba de nuevo.',
    //     'Cerrar',
    //     {
    //       duration: 5000,
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       panelClass: ['error-snackbar']
    //     }
    //   );
    //   input.value = '';
    //   return;
    // }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.messageService.sendMedia(
        this.currentChat!.jid,
        base64,
        file.type,
        this.messageText.trim() || undefined
      );
      this.messageText = '';
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMessageStatusIcon(status?: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'sent': return 'done';
      case 'delivered': return 'done_all';
      case 'read': return 'done_all';
      case 'error': return 'error_outline';
      default: return 'done';
    }
  }

  getMessageStatusClass(status?: string): string {
    return status === 'read' ? 'status-read' : 'status-default';
  }

  isImageMedia(mimetype?: string): boolean {
    const isImage = mimetype?.startsWith('image/') || false;
    return isImage;
  }

  isVideoMedia(mimetype?: string): boolean {
    return mimetype?.startsWith('video/') || false;
  }

  isAudioMedia(mimetype?: string): boolean {
    return mimetype?.startsWith('audio/') || false;
  }

  getMediaSrc(media: any): string {
    // Generar clave única para el cache
    const cacheKey = media.base64Data || media.url || '';

    // OPTIMIZACIÓN: Verificar cache primero
    if (this.mediaSrcCache.has(cacheKey)) {
      return this.mediaSrcCache.get(cacheKey)!;
    }

    let dataUrl = '';

    // PRIORIDAD 1: Si tiene base64Data guardado en BD, usarlo
    if (media.base64Data && media.mime) {
      dataUrl = `data:${media.mime};base64,${media.base64Data}`;
    }
    // PRIORIDAD 2: Si ya tiene una URL completa (desde el backend Go), usarla
    else if (media.url && (media.url.startsWith('http://') || media.url.startsWith('https://'))) {
      dataUrl = media.url;
    }
    // PRIORIDAD 3: Si es base64 en el campo url
    else if (media.url && media.mime) {
      // Verificar si ya tiene el prefijo data:
      if (media.url.startsWith('data:')) {
        dataUrl = media.url;
      } else {
        // Construir el data URL
        dataUrl = `data:${media.mime};base64,${media.url}`;
      }
    }

    if (dataUrl) {
      // Guardar en cache para reutilizar
      this.mediaSrcCache.set(cacheKey, dataUrl);
      return dataUrl;
    }

    console.log('❌ No se pudo generar URL');
    return '';
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer && this.messagesContainer.nativeElement) {
        const container = this.messagesContainer.nativeElement;
        // Scroll directo al final sin animación
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      // Silently ignore if element not ready
    }
  }

  // Audio player methods
  private getAudioElement(msgId: string): HTMLAudioElement | null {
    return document.getElementById('audio-' + msgId) as HTMLAudioElement;
  }

  private initAudioState(msgId: string): void {
    if (!this.audioStates.has(msgId)) {
      this.audioStates.set(msgId, {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        speed: 1
      });
    }
  }

  toggleAudio(event: Event, msgId: string): void {
    event.stopPropagation();
    this.initAudioState(msgId);
    const audio = this.getAudioElement(msgId);
    if (!audio) return;

    const state = this.audioStates.get(msgId)!;

    if (state.isPlaying) {
      audio.pause();
      state.isPlaying = false;
    } else {
      // Pause all other audios
      this.audioStates.forEach((s, id) => {
        if (id !== msgId && s.isPlaying) {
          const otherAudio = this.getAudioElement(id);
          if (otherAudio) otherAudio.pause();
          s.isPlaying = false;
        }
      });

      audio.play();
      state.isPlaying = true;
    }
  }

  isAudioPlaying(msgId: string): boolean {
    return this.audioStates.get(msgId)?.isPlaying || false;
  }

  onAudioTimeUpdate(msgId: string): void {
    const audio = this.getAudioElement(msgId);
    if (!audio) return;

    this.initAudioState(msgId);
    const state = this.audioStates.get(msgId)!;
    state.currentTime = audio.currentTime;

    // Force change detection
    this.audioStates = new Map(this.audioStates);
  }

  onAudioLoaded(msgId: string): void {
    const audio = this.getAudioElement(msgId);
    if (!audio) {
      console.log('❌ Audio element not found:', msgId);
      return;
    }

    this.initAudioState(msgId);
    const state = this.audioStates.get(msgId)!;

    console.log('🎵 Audio loaded:', msgId, 'Duration:', audio.duration, 'readyState:', audio.readyState);

    // Wait for duration to be available
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      state.duration = audio.duration;
      console.log('✅ Duration set:', state.duration);
      this.audioStates = new Map(this.audioStates);
    } else {
      console.log('⏳ Duration not ready, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          state.duration = audio.duration;
          console.log('✅ Duration set (retry):', state.duration);
          this.audioStates = new Map(this.audioStates);
        } else {
          console.log('❌ Duration still not available:', audio.duration);
        }
      }, 200);
    }
  }

  onAudioEnded(msgId: string): void {
    this.initAudioState(msgId);
    const state = this.audioStates.get(msgId)!;
    state.isPlaying = false;
    state.currentTime = 0;
  }

  seekAudio(event: Event, msgId: string): void {
    const input = event.target as HTMLInputElement;
    const audio = this.getAudioElement(msgId);
    if (!audio) return;

    const state = this.audioStates.get(msgId);
    if (!state) return;

    const seekTime = (parseFloat(input.value) / 100) * state.duration;
    audio.currentTime = seekTime;
  }

  changeSpeed(event: Event, msgId: string): void {
    event.stopPropagation();
    const audio = this.getAudioElement(msgId);
    if (!audio) return;

    this.initAudioState(msgId);
    const state = this.audioStates.get(msgId)!;

    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(state.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    state.speed = speeds[nextIndex];
    audio.playbackRate = state.speed;
  }

  getAudioProgress(msgId: string): number {
    const state = this.audioStates.get(msgId);
    if (!state || state.duration === 0) return 0;
    return (state.currentTime / state.duration) * 100;
  }

  getAudioCurrentTime(msgId: string): string {
    const state = this.audioStates.get(msgId);
    if (!state || !state.currentTime || isNaN(state.currentTime)) return '0:00';
    return this.formatAudioTime(state.currentTime);
  }

  getAudioDuration(msgId: string): string {
    const state = this.audioStates.get(msgId);
    if (!state || !state.duration || state.duration === 0 || isNaN(state.duration) || !isFinite(state.duration)) {
      return '0:00';
    }
    return this.formatAudioTime(state.duration);
  }

  getAudioSpeed(msgId: string): number {
    return this.audioStates.get(msgId)?.speed || 1;
  }

  private formatAudioTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Verificar si se puede enviar mensajes
  canSendMessage(): boolean {
    return !this.isChatBlocked && !this.isNewChat && !!this.currentChat;
  }

  // Obtener texto de placeholder
  getInputPlaceholder(): string {
    if (this.isNewChat) {
      return '💬 El cliente debe iniciar esta conversación';
    }
    if (this.isChatBlocked) {
      return '🚫 Chat bloqueado - Espera a que el cliente te escriba';
    }
    return 'Escribe un mensaje...';
  }

  // Obtener tiempo restante formateado
  getTimeRemaining(): string {
    if (this.hoursRemaining > 0) {
      // Si hay horas: mostrar horas y minutos
      return `${this.hoursRemaining}h ${this.minutesRemaining}min`;
    }
    // Si no hay horas: mostrar minutos y segundos
    const seconds = this.secondsRemaining % 60;
    return `${this.minutesRemaining}min ${seconds}seg`;
  }

  // TrackBy function para optimizar el renderizado de mensajes
  trackByMessageId(index: number, message: Message): string {
    return message.msgId;
  }
}
