import { Component } from '@angular/core';
import { AffairesService } from '../../_services/affaires/affaires.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  affaires: any = [];
  selectedAffaire: any | null = null;
  loading = true;
  error: string | null = null;

  constructor(private affaireService: AffairesService) {}

  ngOnInit(): void {
    this.loadAffaires();
  }


  loadAffaires() {
    this.affaireService.getAll().subscribe({
      next: (data) => {
        this.affaires = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des affaires', err);
        this.error = 'Impossible de charger les affaires';
        this.loading = false;
      }
    });
  }

  selectAffaire(affaire: any): void {
    this.selectedAffaire = affaire;
  }

  deleteAffaire(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette affaire ?')) {
      this.affaireService.delete(id).subscribe({
        next: () => {
          // Supprimer l'affaire du tableau local pour mise à jour UI instantanée
          this.loadAffaires();
          alert('Affaire supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Impossible de supprimer cette affaire.');
        }
      });
    }
  }

}
