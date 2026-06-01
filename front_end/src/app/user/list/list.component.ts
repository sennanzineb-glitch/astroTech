import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { UserService } from '../../_services/users/user.service';

@Component({
  selector: 'app-list',
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllUsers();
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
   * ACTION 5 : Bouton "Modifier" (Sauvegarde le rôle actuel ou ouvre votre logique de modification)
   */
  onModify() { 
    if (!this.selectedUser) return;

    // Exemple : Envoi du rôle modifié depuis la liste déroulante <select> du tableau
    const updateData = {
      full_name: this.selectedUser.name,
      email: this.selectedUser.email,
      role: this.selectedUser.role
    };

    this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
      next: (res) => {
        if (res.success) {
          alert(`Utilisateur ${this.selectedUser.name} mis à jour avec succès.`);
          this.loadAllUsers();
        }
      },
      error: (err) => console.error('Erreur lors de la modification:', err)
    });
  }

  /**
   * ACTION 6 : Bouton "Bloquer" / "Activer" (Depuis la barre d'outils du haut)
   */
  onBlock() { 
    if (!this.selectedUser) return;

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