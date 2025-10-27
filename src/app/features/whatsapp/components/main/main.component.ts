import { Component } from '@angular/core';
import { ChatList } from '../chat-list/chat-list/chat-list';
import { ChatWindow } from '../chat-window/chat-window/chat-window';
import { Chat } from '../../../../core/models/message.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ChatList, ChatWindow],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  onChatSelected(chat: Chat): void {
    console.log('Chat seleccionado:', chat.name);
  }
}
