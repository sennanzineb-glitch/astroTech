import { Component } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  // user: any | null = null;
  error: string | null = null;

  user$: Observable<any>;
  changePassword:any;
  loading:any;

  constructor(private authService: AuthService) {
    // On utilise le BehaviorSubject pour avoir toujours la dernière valeur
    this.user$ = this.authService.currentUser$;

    console.log("Bonjour tous le monde !",this.authService.currentUser$);
    
  }

  ngOnInit(): void {
    // Optionnel : si on veut forcer la récupération depuis le backend
    if (!this.authService.isLoggedIn()) return;

    this.authService.fetchMe().subscribe({
      next: () => {},
      error: (err) => console.error('Erreur récupération profil:', err)
    });
  }



  logout() {
    this.authService.logout();
  }

}
