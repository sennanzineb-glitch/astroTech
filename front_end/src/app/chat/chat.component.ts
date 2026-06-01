import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../_services/chat/chat.service';
import { AuthService } from '../_services/auth.service';
import { AdminService } from '../_services/users/admin.service';
import { UserService } from '../_services/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../_globale/shared/shared.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart'; 
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [SharedModule, CommonModule, FormsModule, PickerModule],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private readonly CHAT_API_URL = 'http://localhost:3006';

  contacts: any[] = [];
  onlineUsers: any[] = [];
  selectedContact: any = null;
  messages: any[] = [];
  newMessage: string = '';
  isMinimized: boolean = true;

  selectedFile: File | null = null;
  selectedFileType: 'image' | 'audio' | null = null;

  myId!: number;
  userRole!: string;

  isRecording: boolean = false;
  recordingDuration: number = 0;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private recordingInterval: any;

  showEmojiPicker: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private adminService: AdminService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const authSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.myId = user.id;
        this.userRole = user.role;

        this.chatService.join(this.myId);
        this.loadContacts();

        const onlineSub = this.chatService.getOnlineUsers().subscribe(users => {
          this.onlineUsers = Array.isArray(users) ? users : [];
          this.cdr.detectChanges();
        });
        this.subscriptions.add(onlineSub);

        const msgSub = this.chatService.getMessage().subscribe((msg) => {
          this.handleIncomingMessage(msg);
        });
        this.subscriptions.add(msgSub);

        const readSub = this.chatService.onMessagesMarkedRead().subscribe((data: any) => {
          this.updateMessagesToSeenLocally(data.seenBy);
        });
        this.subscriptions.add(readSub);
      }
    });
    this.subscriptions.add(authSub);
  }

  // 🔥 CORRECTION : Nettoyage strict et normalisation des URL absolues
  sanitizeUrl(url: string): SafeUrl {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http')) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    // Empêche les doubles slashes accidentels à la concaténation
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const absoluteUrl = `${this.CHAT_API_URL}${cleanUrl}`;
    return this.sanitizer.bypassSecurityTrustUrl(absoluteUrl);
  }

  private handleIncomingMessage(msg: any): void {
    if (!this.selectedContact) return;
    const isFromMe = String(msg.sender_id) === String(this.myId);
    const isFromSelected = String(msg.sender_id) === String(this.selectedContact.id);

    if (isFromSelected || isFromMe) {
      const exists = this.messages.some(m => m.id === msg.id);
      if (!exists) {
        this.messages.push(msg);
        if (isFromSelected && !this.isMinimized) {
          this.markConversationAsSeen();
        }
        this.scrollToBottom();
        this.cdr.detectChanges(); // Force le rafraîchissement du nouveau lecteur audio inséré
      }
    }
  }

  private updateMessagesToSeenLocally(seenById: any): void {
    if (this.selectedContact && String(seenById) === String(this.selectedContact.id)) {
      this.messages.forEach(m => {
        if (m.sender_id === this.myId) {
          m.is_read = 1;
        }
      });
      this.cdr.detectChanges();
    }
  }

  private markConversationAsSeen(): void {
    if (this.selectedContact && this.myId) {
      this.chatService.markAsSeen(this.selectedContact.id, this.myId);
    }
  }

  selectContact(contact: any): void {
    this.selectedContact = contact;
    this.showEmojiPicker = false; 
    this.chatService.getHistory(contact.id).subscribe({
      next: (res: any) => {
        this.messages = res.data || [];
        this.scrollToBottom();
        this.markConversationAsSeen();
        this.cdr.detectChanges(); // Notifie le HTML que les audio-players sont prêts
      },
      error: (err) => console.error("Erreur historique:", err)
    });
  }

  loadContacts(): void {
    const serviceCall = this.userRole === 'admin' ? this.userService.getUsers() : this.adminService.getAdmins();
    serviceCall.subscribe({
      next: (res: any) => {
        this.contacts = Array.isArray(res) ? res : (res.data || []);
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur contacts:", err)
    });
  }

  isOnline(userId: any): boolean {
    if (!this.onlineUsers) return false;
    return this.onlineUsers.some(id => String(id) === String(userId));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (file.type.startsWith('image/')) {
        this.selectedFileType = 'image';
      } else if (file.type.startsWith('audio/')) {
        this.selectedFileType = 'audio';
      } else {
        this.selectedFileType = null;
      }
      this.cdr.detectChanges();
    }
  }

  send(): void {
    const text = this.newMessage ? this.newMessage.trim() : '';

    if (!text && !this.selectedFile) {
      return;
    }

    if (this.selectedContact) {
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        
        reader.onloadend = () => {
          const base64Data = reader.result as string;

          this.chatService.sendMessage(
            this.myId, 
            this.selectedContact.id, 
            text, 
            base64Data, 
            this.selectedFileType
          );

          this.clearSelectedFile();
          this.newMessage = '';
          this.scrollToBottom();
          this.cdr.detectChanges();
        };
      } else {
        this.chatService.sendMessage(this.myId, this.selectedContact.id, text);
        this.newMessage = '';
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    }
  }

  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized && this.selectedContact) {
      this.scrollToBottom();
      this.markConversationAsSeen();
    }
    this.cdr.detectChanges();
  }

  public scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
    this.cdr.detectChanges();
  }

  addEmoji(event: any): void {
    this.newMessage += event.emoji.native;
    this.showEmojiPicker = false; 
    this.cdr.detectChanges();
  }

  insertGif(): void {
    this.newMessage = "https://media.giphy.com/v1/gifs/cmCHuk53ulG3S/giphy.gif";
    this.cdr.detectChanges();
  }

  toggleVoiceRecording(): void {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording(true);
    }
  }

  private startRecording(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.audioChunks = [];
        
        let options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'audio/ogg' };
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: '' }; 
        }

        this.mediaRecorder = new MediaRecorder(stream, options);

        this.mediaRecorder.ondataavailable = (event: any) => {
          if (event.data && event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const mimeTypeUsed = this.mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeTypeUsed });
          
          this.selectedFile = new File([audioBlob], `vocal_${Date.now()}.webm`, { type: mimeTypeUsed });
          this.selectedFileType = 'audio';

          stream.getTracks().forEach(track => track.stop());
          this.cdr.detectChanges();
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        this.recordingDuration = 0;
        this.cdr.detectChanges();

        this.recordingInterval = setInterval(() => {
          this.recordingDuration++;
          this.cdr.detectChanges(); 
        }, 1000);
      })
      .catch(err => {
        console.error("Impossible d'accéder au microphone :", err);
      });
  }

  stopRecording(saveFile: boolean): void {
    clearInterval(this.recordingInterval);
    this.isRecording = false;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      if (saveFile) {
        this.mediaRecorder.stop();
      } else {
        this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
        this.clearSelectedFile();
      }
    }
    this.cdr.detectChanges();
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileType = null;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
  }
}