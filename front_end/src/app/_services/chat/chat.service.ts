import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private messageSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.socket = io(environment.socketUrl_chat);

    this.socket.on('receive_message', (data) => {
      this.messageSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('Connecté au serveur de chat');
    });
  }

  join(userId: number): void {
    if (userId) {
      this.socket.emit('join', userId);
    }
  }

  /**
   * Envoyer un message en temps réel avec support optionnel des fichiers médias
   */
  sendMessage(senderId: number, receiverId: number, content: string, fileUrl: string | null = null, fileType: string | null = null): void {
    if ((content && content.trim()) || fileUrl) {
      const payload = { 
        senderId, 
        receiverId, 
        content,
        file_url: fileUrl,  // Contiendra la chaine base64 ou l'URL finale
        file_type: fileType // 'image' ou 'audio'
      };
      this.socket.emit('send_message', payload);
    }
  }

  markAsSeen(senderId: number, receiverId: number): void {
    if (senderId && receiverId) {
      this.socket.emit('mark_messages_seen', { senderId, receiverId });
    }
  }

  onMessagesMarkedRead(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('messages_marked_read', (data) => {
        observer.next(data);
      });
      return () => this.socket.off('messages_marked_read');
    });
  }

  getHistory(receiverId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl_chat}/history/${receiverId}`);
  }

  getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getOnlineUsers(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('user_status_change', (users: any[]) => {
        observer.next(users);
      });
      return () => this.socket.off('user_status_change');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  markAsRead(messageId: number): void {
    if (messageId) {
      this.socket.emit('message_read', { messageId });
    }
  }
}