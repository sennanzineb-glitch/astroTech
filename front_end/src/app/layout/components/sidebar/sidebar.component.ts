import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../_services/auth.service';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, UserComponent, AdminComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false; // Stocke la valeur envoyée par le parent

  userRole: string = '';
  currentUser: any = null;
  initials: string = '';
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
          this.userRole = user.role ? user.role.toLowerCase() : '';
          
          if (user.full_name) {
            this.initials = this.generateInitials(user.full_name);
          }
        } else {
          this.currentUser = null;
          this.userRole = '';
          this.initials = '';
        }
      },
      error: (err) => console.error("Erreur de récupération de l'utilisateur dans la sidebar :", err)
    });
  }

  private generateInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}