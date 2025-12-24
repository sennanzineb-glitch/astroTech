import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../modal-save/modal-save.component';
import { ClientsService } from '../../_services/clients/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule, ModalSaveComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  clients: any[] = [];

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {
    this.getAllClients();
  }

  getAllClients() {
    this.clientsService.getAllClientsWithContacts().subscribe((result: any) => {
      const clientsArray = result as any[]; // cast pour éviter TS2339
      this.clients = clientsArray.map(client => ({
        ...client,
        contacts: client.contacts || []
      }));
    });
  }

  deleteClient(id: number) {
    // Afficher un message de confirmation
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce client ?');

    if (confirmed) {
      this.clientsService.delete(id).subscribe({
        next: () => {
          // Actualiser la liste des clients
          this.getAllClients();
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
    console.log("***",client);
    
    this.router.navigate(['/clients/details', client.id]);
  }

}
