import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../modal-save/modal-save.component';
import { ClientsService } from '../../_services/clients/clients.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule, ModalSaveComponent, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  clients: any[] = [];
  // Pagination
  currentPage: number = 1;
  pageSize: number = 20; // nombre de clients par page
  totalItems: number = 0;
  totalPages: number = 1;

  // Recherche
  searchTerm: string = '';

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {
    this.loadClients();
  }

  loadClients(page: number = 1, search: string = '') {
    this.clientsService.getAllClientsWithContactsPaginated(page, this.pageSize, search).subscribe(
      (res: any) => {
        this.clients = res.data || [];
        this.totalItems = res.total || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = page;
      },
      (err) => console.error('Erreur chargement clients paginés', err)
    );
  }

  searchClients() {
    // Reset à la première page à chaque nouvelle recherche
    this.loadClients(1, this.searchTerm);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadClients(page, this.searchTerm);
  }

  deleteClient(id: number) {
    // Afficher un message de confirmation
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce client ?');

    if (confirmed) {
      this.clientsService.delete(id).subscribe({
        next: () => {
          // Actualiser la liste des clients
          this.loadClients();
          // Optionnel : message de succès
          alert('Client supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Impossible de supprimer ce client.');
        }
      });
    }
  }

  // méthode pour ouvrir le modal et éditer un client
  editClient(client: any) {
    if (this.modalSave) {
      this.modalSave.editClient(client);
    } else {
      console.error('ModalSaveComponent non initialisé !');
    }
  }

  viewDetails(client: any) {
    //this.router.navigate(['/clients/details', client.id]);
    this.router.navigate(['/clients/details', client.id], { queryParams: { type: client.type_client } });
  }

}
