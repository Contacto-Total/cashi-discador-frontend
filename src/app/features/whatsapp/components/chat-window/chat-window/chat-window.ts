import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Message, Chat } from '../../../../../core/models/message.model';
import { MessageService } from '../../../../../core/services/whatsapp/message.service';
import { ApiService } from '../../../../../core/services/whatsapp/api.service';

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
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss'
})
export class ChatWindow implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentChat: Chat | null = null;
  messages: Message[] = [];
  messageText: string = '';
  private shouldScroll = false;

  // Reply state
  replyingTo: Message | null = null;

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

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private snackBar: MatSnackBar
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
        this.checkWindowStatus();
        this.startWindowCheck();
      } else {
        this.stopWindowCheck();
      }
    });

    this.messageService.currentMessages$.subscribe(messages => {
      console.log('📬 Mensajes recibidos:', messages);
      const previousLength = this.messages.length;
      this.messages = messages;
      this.checkIfNewChat();
      this.shouldScroll = true;

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
        }

        if (update.hoursRemaining !== undefined) {
          this.hoursRemaining = update.hoursRemaining;
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
    if (this.shouldScroll) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.stopWindowCheck();
    this.stopCountdown();
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

      } else {
        // Tiempo agotado - bloquear chat automáticamente
        console.log('⏰ Tiempo agotado - Bloqueando chat');
        this.isChatBlocked = true;
        this.windowStatus = { ...this.windowStatus, isBlocked: true, hasActiveWindow: false };
        this.stopCountdown();
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

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onEscapePressed(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.currentChat) {
      event.preventDefault();
      this.messageService.selectChat(null);
    }
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
    // PRIORIDAD 1: Si tiene base64Data guardado en BD, usarlo
    if (media.base64Data && media.mime) {
      const dataUrl = `data:${media.mime};base64,${media.base64Data}`;
      return dataUrl;
    }

    // PRIORIDAD 2: Si ya tiene una URL completa (desde el backend Go), usarla
    if (media.url && (media.url.startsWith('http://') || media.url.startsWith('https://'))) {
      console.log('✅ URL completa:', media.url);
      return media.url;
    }

    // PRIORIDAD 3: Si es base64 en el campo url
    if (media.url && media.mime) {
      // Verificar si ya tiene el prefijo data:
      if (media.url.startsWith('data:')) {
        console.log('✅ Data URL ya formado');
        return media.url;
      }
      // Construir el data URL
      const dataUrl = `data:${media.mime};base64,${media.url}`;
      console.log('✅ Data URL construido:', dataUrl.substring(0, 100) + '...');
      return dataUrl;
    }

    console.log('❌ No se pudo generar URL');
    return '';
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer && this.messagesContainer.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
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
}
