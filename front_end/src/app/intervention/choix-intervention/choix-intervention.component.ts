import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../_globale/shared/shared.module';
import { AffairesService } from '../../_services/affaires/affaires.service';

declare var bootstrap: any;

@Component({
  selector: 'app-choix-intervention',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './choix-intervention.component.html',
  styleUrls: ['./choix-intervention.component.css']
})
export class ChoixInterventionComponent {

  modal: any;
  typeCreation: 'rapide' | 'affaire' | null = null;

  affaires: any[] = [];
  loading = false;

  page = 1;
  limit = 10;
  total = 0;
  searchTerm = '';

  constructor(
    private router: Router,
    private affaireService: AffairesService
  ) {}

  continuer() {

    if (this.typeCreation === 'rapide') {
      this.router.navigate(['/interventions/edit']);
      return;
    }

    if (this.typeCreation === 'affaire') {
      this.loadAffaires();

      this.modal = new bootstrap.Modal(
        document.getElementById('affaireModal')
      );

      this.modal.show();
    }
  }

  goToIntervention(affaire: any) {

    if (this.modal) {
      this.modal.hide();
    }

    this.router.navigate(
      ['/interventions/edit'],
      { queryParams: { affaireId: affaire.affaireId } }
    );
  }

  loadAffaires() {

    this.loading = true;

    this.affaireService
      .getAllPaginated(this.page, this.limit, this.searchTerm)
      .subscribe({
        next: (res: any) => {

          this.affaires = res.data;
          this.page = res.page;
          this.limit = res.limit;
          this.total = res.total;

          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  searchAffaires() {
    this.page = 1;
    this.loadAffaires();
  }

  // pagination
  get totalPages(): number[] {

    const pages = Math.ceil(this.total / this.limit);

    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  changePage(p: number) {

    if (p < 1 || p > this.totalPages.length) return;

    this.page = p;
    this.loadAffaires();
  }

}