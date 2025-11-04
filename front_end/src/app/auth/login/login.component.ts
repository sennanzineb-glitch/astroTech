import { Component } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../_globale/shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model = { email: '', password: '' };
  error?: string;
  showPassword = false;
  loading = false; // 👈 pour afficher un spinner pendant la connexion

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.error = undefined;
    this.loading = true;

    this.auth.login(this.model).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/clients/list']);
      },
      error: (err) => {
        this.loading = false;

        // Gestion des différents cas d'erreur
        if (err.status === 401) {
          this.error = 'Adresse email ou mot de passe incorrect.';
        } else if (err.status === 0) {
          this.error = 'Serveur injoignable. Vérifiez votre connexion.';
        } else {
          this.error = err.error?.message || 'Une erreur est survenue.';
        }
      }
    });
  }
}

