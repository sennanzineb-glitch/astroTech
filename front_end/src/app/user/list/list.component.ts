import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { UserService } from '../../_services/users/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  // Liste des utilisateurs alimentée par l'API
  users: any[] = [];
  
  // Variables pour la vue d'ensemble (Statistiques)
  activeCount: number = 0;
  blockedCount: number = 0;

  // Garde en mémoire l'utilisateur cliqué dans le tableau
  selectedUser: any = null;

  // Stocke l'ID de l'admin actuellement connecté pour la sécurité
  currentAdminId: number = 0; 

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAdminId = this.getConnectedUserId();
    this.loadAllUsers();
  }

  /**
   * Récupère l'ID de l'utilisateur connecté depuis la session ou le localStorage
   */
  getConnectedUserId(): number {
    // S'adapte à votre système d'authentification (ex: localStorage, service auth, etc.)
    const storedId = localStorage.getItem('user_id');
    return storedId ? parseInt(storedId, 10) : 1; 
  }

  /**
   * ACTION 1 : Charger l'ensemble des utilisateurs (Admins + Users)
   */
  loadAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data.map((u: any) => ({
            id: u.id,
            name: u.full_name,
            email: u.email,
            role: u.role, 
            lastLogin: u.derniere_connexion || 'Aucune connexion', 
            status: !!u.is_active 
          }));

          // Met à jour les compteurs à partir des données fraîches reçues
          this.updateLocalStats();
          
          // Resynchronise l'état de l'utilisateur sélectionné si la liste est rechargée
          if (this.selectedUser) {
            const updatedUser = this.users.find(u => u.id === this.selectedUser.id);
            this.selectedUser = updatedUser ? updatedUser : null;
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

  /**
   * ACTION 2 : Sélectionner/Désélectionner une ligne du tableau
   */
  selectUser(user: any) {
    this.selectedUser = this.selectedUser?.id === user.id ? null : user;
  }

  /**
   * ACTION 3 : Recalculer instantanément les statistiques de droite
   */
  updateLocalStats(): void {
    this.activeCount = this.users.filter(u => u.status).length;
    this.blockedCount = this.users.filter(u => !u.status).length;
  }

  /**
   * ACTION 4 : Interrupteur Switch (Activer/Bloquer en direct sur la ligne)
   */
  onStatusToggle(user: any): void {
    // SÉCURITÉ : Empêcher de désactiver son propre compte admin connecté
    if (user.id === this.currentAdminId) {
      alert("Action impossible : vous ne pouvez pas désactiver votre propre compte session.");
      user.status = true; // Force le switch à rester actif graphiquement
      return;
    }

    this.userService.toggleStatus(user.id, user.status).subscribe({
      next: (res) => {
        if (res.success) {
          this.updateLocalStats();
          console.log(`Statut mis à jour pour ${user.name} : ${user.status ? 'Actif' : 'Bloqué'}`);
        }
      },
      error: (err) => {
        user.status = !user.status; // Restaure l'état graphique si le serveur rejette l'action
        console.error('Erreur de mise à jour du statut:', err);
      }
    });
  }

  /**
   * ACTION 5 : Bouton "Modifier" (Sauvegarde le rôle actuel sélectionné dans le tableau)
   */
onModify() { 
    if (!this.selectedUser || !this.selectedUser.id) return;

    // Redirige vers la page de modification avec l'ID de l'utilisateur
    // Exemple d'URL générée : /users/edit/5
    this.router.navigate(['/admin/user/edit/', this.selectedUser.id]);
  }

  /**
   * ACTION 6 : Bouton "Bloquer" / "Activer" (Depuis la barre d'outils du haut)
   */
  onBlock() { 
    if (!this.selectedUser) return;

    if (this.selectedUser.id === this.currentAdminId) {
      alert("Action impossible : Vous ne pouvez pas bloquer votre propre compte admin.");
      return;
    }

    // Inverse le statut actuel
    const nextStatus = !this.selectedUser.status;
    
    this.userService.toggleStatus(this.selectedUser.id, nextStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedUser.status = nextStatus;
          this.loadAllUsers(); // Rafraîchit les listes et les compteurs globaux
        }
      },
      error: (err) => console.error('Erreur lors du changement de statut:', err)
    });
  }

  /**
   * ACTION 7 : Bouton "MDP" (Réinitialiser le mot de passe)
   */
  onResetPassword() { 
    if (!this.selectedUser) return;

    const newPassword = prompt(`Saisir le nouveau mot de passe pour ${this.selectedUser.name} :`);
    if (!newPassword || newPassword.trim() === '') return;

    // CORRECTION : Passage direct de la string 'newPassword' pour éliminer l'erreur TS2345
    this.userService.updatePassword(this.selectedUser.id, newPassword).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Le mot de passe a été modifié avec succès.');
        }
      },
      error: (err) => console.error('Erreur lors de la réinitialisation du mot de passe:', err)
    });
  }

  /**
   * ACTION 8 : Bouton "Supprimer"
   */
  onDelete() { 
    if (!this.selectedUser) return;

    if (this.selectedUser.id === this.currentAdminId) {
      alert("Action impossible : Vous ne pouvez pas supprimer le compte avec lequel vous êtes connecté.");
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${this.selectedUser.name} ?`)) {
      this.userService.deleteUser(this.selectedUser.id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Utilisateur supprimé.');
            this.selectedUser = null; // Nettoie la sélection
            this.loadAllUsers();     // Recharge le tableau sans le profil supprimé
          }
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    } 
  }
}