import { Component, ViewChild, OnInit } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../modal-save/modal-save.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../_services/clients/clients.service';
import { SecteurService } from '../../_services/clients/secteur.service';
import { HabitationService } from '../../_services/clients/habitation.service';
import { OrganisationsService } from '../../_services/clients/organisations.service';
import { ParticuliersService } from '../../_services/clients/particuliers.service';
import { AgencesService } from '../../_services/clients/agences.service';

@Component({
  selector: 'app-details',
  imports: [SharedModule, ModalSaveComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  id!: number;
  client: any;
  clients: any[] = [];
  activeTab: string = 'details'; // Onglet par défaut

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private secteurService: SecteurService,
    private habitationService: HabitationService,
    private organisationsService: OrganisationsService,
    private particuliersService: ParticuliersService,
    private agencesService: AgencesService
  ) { }

  ngOnInit(): void {
    // Écouter les changements d'ID dans l'URL
    this.route.paramMap.subscribe(params => {
      // Récupérer l'ID depuis l'URL
      this.id = +this.route.snapshot.params['id'];
      // Récupérer le type depuis les query params
      const type = this.route.snapshot.queryParams['type'];
      this.loadClient(this.id, type); // Appel avec deux paramètres
      this.resetView();
    });
  }

  // Charger les données du client selon le type
  loadClient(id: number, type: string) {
    if (type === 'secteur') {
      // Si le client est de type secteur, utiliser secteurService
      this.secteurService.getRecordDetails(id).subscribe({
        next: (sectRes: any) => {
          this.client = sectRes;
          this.getAllClients();
        },
        error: (err: any) => {
          console.error("Erreur chargement client secteur :", err);
          alert("Impossible de charger le client secteur.");
        }
      });
    } else {
      // Organisation, agence, particulier
      this.clientsService.getRecordDetails(id).subscribe({
        next: (sectRes: any) => {
          this.client = sectRes.data;
          console.log("detail_client", sectRes.data);
          
          this.getAllClients();
        },
        error: (err: any) => {
          console.error("Erreur chargement client secteur :", err);
          alert("Impossible de charger le client secteur.");
        }
      });
    }
  }

  // Charger les clients enfants
  getAllClients() {
    this.clientsService.getClientsByParentWithDetails(this.id).subscribe((result: any) => {
      this.clients = (result as any[]).map(client => ({
        ...client,
        contacts: client.contacts || []
      }));
    });
  }

  // Réinitialiser la vue lors du changement de client
  resetView() {
    this.activeTab = 'details';          // onglet par défaut
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll en haut
  }

  // Ouvrir le modal pour ajouter un client enfant
  addChilderClient() {
    if (this.modalSave) {
      if (['organisation', 'particulier', 'agence'].includes(this.client.type_client)) 
        this.modalSave.addChilderClient(this.client.type_client, this.client.client_id);
      else
        this.modalSave.addChilderClient(this.client.type_client, this.client.id);
    } else {
      console.error('ModalSaveComponent non initialisé !');
    }
  }

  // Supprimer un client par type
  deleteClient(id: number) {
    const client = this.clients.find(c => c.id === id);

    if (!client) {
      alert("Client introuvable !");
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer ce client ?')) {
      return;
    }

    const type = client.type_client?.toLowerCase();

    const deleteMap: Record<string, () => any> = {
      organisation: () => this.clientsService.delete(id),
      agence: () => this.clientsService.delete(id),
      particulier: () => this.clientsService.delete(id),
      secteur: () => this.secteurService.delete(id),
      habitation: () => this.habitationService.delete(id)
    };

    const deleteFn = deleteMap[type];

    if (!deleteFn) {
      alert("Type de client inconnu, impossible de supprimer.");
      console.error("Type client inconnu :", client.type_client);
      return;
    }

    deleteFn().subscribe({
      next: () => {
        this.getAllClients();
        alert("Client supprimé avec succès !");
      },
      error: (err: any) => {
        console.error("Erreur de suppression :", err);
        alert("Impossible de supprimer ce client.");
      }
    });
  }

  // Naviguer vers les détails d’un client enfant
  viewDetails(client: any) {
    this.router.navigate(['/clients/details', client.id], { queryParams: { type: client.type_client } });
  }


  // Ouvrir le modal pour éditer un client
  editClient(client: any) {
    if (this.modalSave) {
      this.modalSave.editClient(client);
    } else {
      console.error('ModalSaveComponent non initialisé !');
    }
  }

  // Gérer le changement d’onglet
  selectTab(tabName: string) {
    this.activeTab = tabName;
  }

  saveNote() {
    if (!this.client.note?.trim()) {
      alert('La note ne peut pas être vide');
      return;
    }

    // Map type_client → service correspondant
    const serviceMap: { [key: string]: any } = {
      'agence': this.secteurService,          // ou AgencesService si c’est plus approprié
      'organisation': this.organisationsService,
      'particulier': this.particuliersService,
      'secteur': this.secteurService,
      // ajouter 'habitation' si nécessaire
    };

    const service = serviceMap[this.client.type_client];

    if (!service) {
      console.error('Service non défini pour le type client :', this.client.type_client);
      return;
    }

    service.updateNote(this.client.id, this.client.note).subscribe({
      next: () => alert('Note enregistrée avec succès !'),
      error: (err: any) => console.error('Erreur lors de l\'enregistrement de la note', err)
    });
  }


}
