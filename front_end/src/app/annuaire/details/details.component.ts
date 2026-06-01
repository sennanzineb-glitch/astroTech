import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  combineLatest,
  Subject
} from 'rxjs';
import {
  takeUntil
} from 'rxjs/operators';

import { SharedModule } from '../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../modal-save/modal-save.component';

import { ClientsService } from '../../_services/clients/clients.service';
import { SecteurService } from '../../_services/clients/secteur.service';
import { HabitationService } from '../../_services/clients/habitation.service';
import { OrganisationsService } from '../../_services/clients/organisations.service';
import { ParticuliersService } from '../../_services/clients/particuliers.service';
import { AgencesService } from '../../_services/clients/agences.service';

import {
  NavigationService,
  NavStep
} from '../../_services/navigation.service';

declare const bootstrap: any;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ModalSaveComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @ViewChild('modalSave')
  modalSave!: ModalSaveComponent;

  Math = Math;

  private readonly destroy$ = new Subject<void>();

  id!: number;
  currentType = '';

  client: any = null;
  clients: any[] = [];
  iHistory: any[] = [];
  affaires: any[] = [];
  selectedIntervention: any = null;

  // Pagination enfants
  clientsPage = 1;
  clientsLimit = 4;
  clientsTotal = 0;

  // Pagination interventions
  historyPage = 1;
  historyLimit = 10;
  historyTotal = 0;

  // Pagination affaires
  affairesPage = 1;
  affairesLimit = 10;
  affairesTotal = 0;
  affairesSearch = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly clientsService: ClientsService,
    private readonly secteurService: SecteurService,
    private readonly habitationService: HabitationService,
    private readonly organisationsService: OrganisationsService,
    private readonly particuliersService: ParticuliersService,
    private readonly agencesService: AgencesService,
    public readonly navService: NavigationService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        const id = Number(params.get('id'));
        const type = queryParams.get('type');

        if (!id || !type) {
          this.goToRoot();
          return;
        }

        this.id = id;
        this.currentType = type.toLowerCase();

        this.resetPagination();
        this.loadClient(this.id, this.currentType);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charger le client
   */
  loadClient(id: number, type: string): void {

    const request = this.getClientRequest(id, type);

    request.subscribe({
      next: (response: any) => {

        this.client = response?.data ?? response;

        if (!this.client) {
          console.warn('Client vide ou introuvable');
          return;
        }

        // 🔥 NORMALISATION TYPE (IMPORTANT)
        const typeMap: any = {
          agence: 'client',
          organisation: 'client',
          particulier: 'client',
          client: 'client',
          secteur: 'secteur',
          habitation: 'habitation'
        };

        const normalizedType = typeMap[type] || type;

        // 📌 LABEL PROPRE
        const label =
          this.client.nom_client ||
          this.client.nom ||
          this.client.reference ||
          'Détails';

        // 🔥 ANTI DOUBLON BREADCRUMB
        const last = this.navService['path']?.slice(-1)[0];

        const isSame =
          last &&
          last.id === id &&
          last.type === normalizedType;

        if (!isSame) {
          this.navService.pushStep(id, label, normalizedType);
        }

        // 📌 LOAD DATA
        this.getAllClients();
        this.loadHistoryInterventions();
        this.loadHistoriqueAffaire();
      },

      error: (error) => {
        console.error('Erreur lors du chargement du client :', error);
      }
    });
  }

  /**
   * Choisir le bon service
   */
  private getClientRequest(id: number, type: string) {
    switch (type) {
      case 'secteur':
        return this.secteurService.getRecordDetails(id);

      case 'habitation':
        return this.habitationService.getRecordDetails(id);

      default:
        return this.clientsService.getRecordDetails(id);
    }
  }

  /**
   * Retour à la liste
   */
  goToRoot(): void {
    this.navService.reset();
    this.router.navigate(['/clients/list']);
  }

  /**
   * Navigation breadcrumb
   */
  goToStep(step: NavStep): void {
    this.navService.navigateTo(step);

    this.router.navigate(
      ['/clients/details', step.id],
      {
        queryParams: {
          type: step.type
        }
      }
    );
  }

  /**
   * Charger les enfants
   */
  getAllClients(
    page: number = this.clientsPage
  ): void {
    if (!this.client) {
      return;
    }

    this.clientsPage = page;

    this.clientsService
      .getClientsByParentWithDetails(
        this.id,
        this.client.type_client,
        this.clientsPage,
        this.clientsLimit,
        ''
      )
      .subscribe({
        next: (result: any) => {
          this.clientsTotal = result?.total ?? 0;
          this.clients = (result?.data ?? []).map(
            (client: any) => ({
              ...client,
              contacts: client.contacts ?? []
            })
          );
        },
        error: (error) => {
          console.error(
            'Erreur chargement enfants :',
            error
          );
        }
      });
  }

  /**
   * Historique interventions
   */
  loadHistoryInterventions(
    page: number = this.historyPage
  ): void {
    this.historyPage = page;

    this.clientsService
      .getByClient(
        this.id,
        this.historyPage,
        this.historyLimit,
        ''
      )
      .then((response: any) => {
        this.iHistory = response?.data ?? [];
        this.historyTotal = response?.total ?? 0;
      })
      .catch((error: any) => {
        console.error(
          'Erreur interventions :',
          error
        );
      });
  }

  /**
   * Historique affaires
   */
  loadHistoriqueAffaire(
    page: number = this.affairesPage
  ): void {
    this.affairesPage = page;

    this.clientsService
      .getAffairesByClient(
        this.id,
        this.affairesPage,
        this.affairesLimit,
        this.affairesSearch
      )
      .subscribe({
        next: (response: any) => {
          this.affaires = response?.affaires ?? [];
          this.affairesTotal = response?.total ?? 0;
        },
        error: (error) => {
          console.error(
            'Erreur chargement affaires :',
            error
          );
        }
      });
  }

  /**
   * Sauvegarder note
   */
  saveNote(): void {
    if (!this.client?.note?.trim()) {
      return;
    }

    const services: Record<string, any> = {
      agence: this.agencesService,
      organisation: this.organisationsService,
      particulier: this.particuliersService,
      secteur: this.secteurService,
      habitation: this.habitationService
    };

    const service =
      services[this.client.type_client];

    if (!service) {
      return;
    }

    service
      .updateNote(this.id, this.client.note)
      .subscribe({
        next: () => {
          alert('✅ Note enregistrée');
        },
        error: (error: any) => {
          console.error(
            'Erreur sauvegarde note :',
            error
          );
        }
      });
  }

  /**
   * Supprimer client
   */
  deleteClient(id: number): void {
    if (
      !confirm(
        'Voulez-vous vraiment supprimer cet élément ?'
      )
    ) {
      return;
    }

    this.clientsService.delete(id).subscribe({
      next: () => {
        this.getAllClients();
        alert('🗑️ Supprimé avec succès');
      },
      error: (error) => {
        console.error(
          'Erreur suppression :',
          error
        );
      }
    });
  }

  /**
   * Ajouter enfant
   */
  addChilderClient(): void {
    if (!this.modalSave || !this.client) {
      return;
    }

    const parentId =
      ['organisation', 'particulier', 'agence']
        .includes(this.client.type_client)
        ? this.client.client_id
        : this.client.id;

    this.modalSave.addChilderClient(
      this.client.type_client,
      parentId
    );
  }

  /**
   * Modifier client
   */
  editClient(client: any): void {
    if (!this.modalSave) {
      return;
    }

    this.modalSave.editClient({
      ...client,
      type_parent: this.client.type_client
    });
  }

  /**
   * Détails intervention
   */
  openInterventionModal(item: any): void {
    this.selectedIntervention = item;

    const modalElement = document.getElementById(
      'interventionDetailModal'
    );

    if (!modalElement) {
      return;
    }

    new bootstrap.Modal(modalElement).show();
  }

  /**
   * Voir détails
   */
  viewDetails(client: any): void {

    console.log('*** CLIENT OBJECT ***', client);

    if (!client?.id || !client?.type_client) {
      console.error('Navigation annulée: client invalide', client);
      return;
    }

    // 🔥 NORMALISATION TYPE (TRÈS IMPORTANT)
    const typeMap: any = {
      agence: 'client',
      organisation: 'client',
      particulier: 'client',
      client: 'client',
      secteur: 'secteur',
      habitation: 'habitation'
    };

    const normalizedType = typeMap[client.type_client] || 'client';

    // 🔗 URL propre (debug)
    const url = `/clients/details/${client.id}?type=${normalizedType}`;
    console.log('🔗 Navigation URL :', url);

    // 🚀 navigation Angular
    this.router.navigate(['/clients/details', client.id], {
      queryParams: {
        type: normalizedType
      }
    });
  }

  /**
   * Pagination
   */
  get totalPagesClients(): number {
    return Math.ceil(
      this.clientsTotal / this.clientsLimit
    );
  }

  get affairesTotalPages(): number {
    return Math.ceil(
      this.affairesTotal / this.affairesLimit
    );
  }

  onPageChange(page: number): void {
    if (
      page >= 1 &&
      page <= this.totalPagesClients
    ) {
      this.getAllClients(page);
    }
  }

  searchAffaires(): void {
    this.affairesPage = 1;
    this.loadHistoriqueAffaire();
  }

  nextAffairesPage(): void {
    if (
      this.affairesPage <
      this.affairesTotalPages
    ) {
      this.loadHistoriqueAffaire(
        this.affairesPage + 1
      );
    }
  }

  prevAffairesPage(): void {
    if (this.affairesPage > 1) {
      this.loadHistoriqueAffaire(
        this.affairesPage - 1
      );
    }
  }

  nextHistoryPage(): void {
    if (
      this.historyPage * this.historyLimit <
      this.historyTotal
    ) {
      this.loadHistoryInterventions(
        this.historyPage + 1
      );
    }
  }

  prevHistoryPage(): void {
    if (this.historyPage > 1) {
      this.loadHistoryInterventions(
        this.historyPage - 1
      );
    }
  }

  /**
   * Réinitialiser paginations
   */
  private resetPagination(): void {
    this.clientsPage = 1;
    this.historyPage = 1;
    this.affairesPage = 1;
  }
}