import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Requis pour ngStyle et ngIf
import { FormsModule } from '@angular/forms'; // Requis pour ngModel
import { AffairesService } from '../../_services/affaires/affaires.service';

declare var bootstrap: any;

@Component({
  selector: 'app-choix-intervention',
  standalone: true, // Vérifiez que vous êtes bien en mode standalone
  imports: [CommonModule, FormsModule, RouterModule], // AJOUTEZ CES MODULES ICI
  templateUrl: './choix-intervention.component.html'
})
export class ChoixInterventionComponent implements OnInit {
  modalInstance: any;
  affaires: any[] = [];
  searchTerm = '';
  page = 1;
  limit = 10;
  typeCreation: string | null = null; // Pour gérer l'UI du choix

  constructor(private router: Router, private affaireService: AffairesService) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  // CORRECTION : Ajout de la méthode manquante pour le bouton Annuler
  annuler() {
    this.router.navigate(['/interventions/list']);
  }

  // Pour la sélection des options dans le HTML
  selectOption(type: string) {
    this.typeCreation = type;
    if (type === 'rapide') {
      this.router.navigate(['/interventions/edit']);
    } else {
      this.openModal();
    }
  }

  loadAffaires() {
    this.affaireService.getAllPaginated(this.page, this.limit, this.searchTerm).subscribe({
      next: (res: any) => {
        this.affaires = res.data;
      },
      error: (err) => console.error('Erreur chargement:', err)
    });
  }

  openModal() {
    this.loadAffaires();
    const modalElement = document.getElementById('affaireModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.split(' ');
    return parts.length >= 2 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
      : name.substring(0, 2).toUpperCase();
  }

  getAvatarStyle(text: string): any {
    if (!text) return { 'background-color': '#ccc' };
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return { 
      'background-color': `hsl(${h}, 60%, 50%)`, 
      'color': 'white', 
      'width': '35px', 
      'height': '35px', 
      'border-radius': '50%',
      'display': 'inline-flex', 
      'align-items': 'center', 
      'justify-content': 'center',
      'font-size': '12px', 
      'font-weight': 'bold', 
      'border': '2px solid white',
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1)', 
      'margin-left': '-10px'
    };
  }

  goToIntervention(affaire: any) {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.router.navigate(['/interventions/edit'], { queryParams: { affaireId: affaire.affaireId } });
  }
}