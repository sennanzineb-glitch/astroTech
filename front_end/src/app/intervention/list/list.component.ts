import { Component } from '@angular/core';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  interventions: any[] = [];
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  limit: number = 20;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private interventionService: InterventionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions(page: number = 1, search: string = '') {
    this.interventionService.getAllPaginated(page, this.limit, search).subscribe({
      next: (res: any) => {
        this.interventions = res.data;
        this.currentPage = res.page;
        this.totalPages = Math.ceil(res.total / res.limit);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  searchInterventions() {
    this.loadInterventions(1, this.searchTerm);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadInterventions(page, this.searchTerm);
  }

  openDetail(id: number) {
    this.router.navigate(['/interventions/details', id]);
  }

  addIntervention() {
    this.router.navigate(['/interventions/edit']);
  }

  editIntervention(id: number) {
    this.router.navigate(['/interventions/edit', id]);
  }

  goToAddIntervention() {
    this.router.navigate(['/interventions']);
  }

  deleteIntervention(id: number) {
    if (!id) return;
    if (!confirm("Voulez-vous vraiment supprimer cette intervention ?")) return;

    this.interventionService.delete(id).subscribe({
      next: () => this.loadInterventions(this.currentPage, this.searchTerm),
      error: err => console.error(err)
    });
  }

  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'en_cours': return 'bg-primary';
      case 'terminee': return 'bg-success';
      case 'annulee': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getEtatIcon(etat: string): string {
    switch (etat) {
      case 'en_cours': return 'fa fa-spinner';
      case 'terminee': return 'fa fa-check-circle';
      case 'annulee': return 'fa fa-times-circle';
      default: return 'fa fa-question-circle';
    }
  }
}
