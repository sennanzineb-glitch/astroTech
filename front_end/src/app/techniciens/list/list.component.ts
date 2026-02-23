import { Component } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TechnicienService } from '../../_services/techniciens/technicien.service';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  techniciens: any = [];
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  limit: number = 10; // nombre de techniciens par page
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private technicienService: TechnicienService) {
    this.loadTechniciens();
  }

  // 🔄 Charger les techniciens avec pagination et recherche
  loadTechniciens() {
    this.technicienService.apiGetAllWithPaginated(this.currentPage, this.limit, this.searchTerm)
      .subscribe((res: any) => {
        this.techniciens = (res.data as any[]).map(t => ({
          ...t,
          showPassword: false
        }));
        this.totalItems = res.total;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
      });
  }

  // 🔍 Recherche
  searchTechniciens() {
    this.currentPage = 1; // revenir à la première page
    this.loadTechniciens();
  }

  // ⬅️➡️ Pagination
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadTechniciens();
  }

  togglePassword(technicien: any) {
    technicien.showPassword = !technicien.showPassword;
  }

  deleteTechnicien(id: number) {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce technicien ?');

    if (confirmed) {
      this.technicienService.delete(id).subscribe({
        next: () => {
          this.loadTechniciens();
          alert('Technicien supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Impossible de supprimer ce technicien.');
        }
      });
    }
  }
}
