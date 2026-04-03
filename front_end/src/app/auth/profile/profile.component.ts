import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true, // Assurez-vous qu'il est standalone si vous utilisez imports
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user$: Observable<any>;
  error: string | null = null;
  showPassword = false;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.fetchMe().subscribe();
    }
  }

  // --- Mise à jour du profil (Nom et Email) ---
  updateProfile(user: any) {
    const payload = {
      full_name: user.full_name,
      email: user.email
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => alert('Profil mis à jour avec succès !'),
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur lors de la mise à jour');
      }
    });
  }

  // --- Changement du mot de passe ---
  changePassword(form: NgForm) {
    const { currentPassword, newPassword, confirmPassword } = form.value;

    // Debug pour voir s'il y a un espace caché ou une faute de frappe
    console.log('Nouveau:', newPassword);
    console.log('Confirmation:', confirmPassword);

    if (newPassword !== confirmPassword) {
      this.error = "Les mots de passe saisis sont différents.";
      alert('Attention : Les deux champs du nouveau mot de passe doivent être identiques.');
      return;
    }

    this.authService.updatePassword({
      oldPassword: currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        alert('Succès ! Votre mot de passe a été mis à jour.');
        form.reset();
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur : Vérifiez votre mot de passe actuel.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}