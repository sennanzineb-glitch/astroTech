import { Component, ElementRef, HostListener, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from '../../../_services/chat/chat.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>(); // Événement envoyé au parent

  unreadMessagesCount: number = 0;
  user$: Observable<any>;
  myId: number | null = null;

  isDropdownOpen = false;
  isNotificationOpen = false;

  private msgSubscription!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private eRef: ElementRef,
    private chatService: ChatService
  ) {
    this.user$ = this.auth.currentUser$;
  }

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      if (user) this.myId = user.id;
    });

    this.msgSubscription = this.chatService.getMessage().subscribe(msg => {
      if (this.myId && msg.receiver_id === this.myId) {
        this.unreadMessagesCount++;
      }
    });

    this.chatService.onMessagesMarkedRead().subscribe((data: any) => {
      if (this.myId && String(data.seenBy) === String(this.myId)) {
        this.unreadMessagesCount = 0;
      }
    });
  }

  onToggleMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleSidebar.emit(); // Notifie le parent du clic sur le bouton hamburger
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isNotificationOpen = false;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotifications(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  resetNotification() {
    this.unreadMessagesCount = 0;
    this.isNotificationOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.isNotificationOpen = false;
    }
  }

  getInitials(name: any): string {
    if (!name || typeof name !== 'string') return 'U';
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.charAt(0).toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.isNotificationOpen = false;
  }

  ngOnDestroy() {
    if (this.msgSubscription) this.msgSubscription.unsubscribe();
  }
}