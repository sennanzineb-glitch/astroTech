import { Component } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user$: Observable<any>;
  isDropdownOpen = false; // État du menu

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.currentUser$;
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Ferme le menu si on clique sur un lien ou ailleurs
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  getInitials(name: any): string {
    if (!name || typeof name !== 'string') return 'U';
    return name.charAt(0).toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}