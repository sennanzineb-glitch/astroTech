import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from '../_globale/shared/shared.module';
import { DashboardService } from '../_services/affaires/dashboard.service';
import { InterventionService } from '../_services/affaires/intervention.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

interface CardItem {
  type_id: number;
  title: string;
  count: number;
  bg: string;
  // … autres propriétés existantes
  position?: { x: number; y: number }; // <-- ajouter cette ligne
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboard: any = {};
  selectedItem: CardItem | null = null;

  /** Colonnes */
  leftBlocs: CardItem[][] = [];
  rightBlocs: CardItem[][] = [];

  /** Modal & pagination */
  interventions: any[] = [];
  loadingModal = false;
  page = 1;
  limit = 5;
  pagination: any = { totalPages: 0 };

  constructor(
    private dashboardService: DashboardService,
    private interventionService: InterventionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.getInterventionsDashboard()
      .subscribe(response => {
        // si ton API renvoie { success, data }
        this.dashboard = response.data ?? response;
        this.buildDashboard();
      });
  }

  /** ================= CONSTRUCTION DU DASHBOARD ================= */
  buildDashboard(): void {
    const travaux = this.buildBlocs(this.dashboard['Travaux principaux']);
    const autoControle = this.buildBlocs(this.dashboard['Auto-contrôle']);
    const quitus = this.buildBlocs(this.dashboard['Quitus']);

    /** Gauche = Auto-contrôle */
    this.leftBlocs = autoControle;

    /** Droite = Quitus + Travaux */
    this.rightBlocs = [...quitus, ...travaux];
  }

  /** ================= 3 CARTES PAR TYPE ================= */
  buildBlocs(groupData: any): CardItem[][] {
    if (!groupData) return [];

    const blocs: CardItem[][] = [];

    Object.keys(groupData).forEach(type => {
      const etats = groupData[type];

      blocs.push([
        {
          type_id: etats.type_id,
          title: type,
          count: etats.PLANIFIE ?? 0,
          bg: 'bg-primary'
        },
        {
          type_id: etats.type_id,
          title: type,
          count: etats.EN_COURS ?? 0,
          bg: 'bg-warning'
        },
        {
          type_id: etats.type_id,
          title: type,
          count: etats.TERMINE ?? 0,
          bg: 'bg-success'
        }
      ]);
    });

    return blocs;
  }

  /** ================= ÉTAT ================= */
  getEtatFromBg(bg: string): string {
    switch (bg) {
      case 'bg-primary': return 'PLANIFIÉ';
      case 'bg-warning': return 'EN COURS';
      case 'bg-success': return 'TERMINÉ';
      default: return '';
    }
  }

  /** ================= MODAL ================= */
  openModal(item: CardItem) {

    this.selectedItem = item;
    this.page = 1;

    this.loadInterventions();

    this.selectedItem = item;

    const modal = new bootstrap.Modal(
      document.getElementById('cardModal')
    );
    modal.show();

  }

  //

  normalizeEtat(etat: string): string {
    if (!etat) return '';

    switch (etat.toUpperCase()) {
      case 'PLANIFIÉ':
        return 'planifie';       // ou 'planifie' selon ce que ton backend attend
      case 'EN COURS':
        return 'en_cours';
      case 'TERMINÉ':
        return 'terminee';
      default:
        return etat.toLowerCase(); // passe tout le reste en minuscule
    }
  }

  loadInterventions() {
    if (!this.selectedItem) return;

    this.loadingModal = true;
    const etatBackend = this.normalizeEtat(this.getEtatFromBg(this.selectedItem.bg));

    this.interventionService
      .getByTypePaginated(
        this.selectedItem.type_id,
        this.page, this.limit,
        etatBackend
      )
      .subscribe(res => {
        this.interventions = res.data;
        this.pagination = res.pagination;
      });
  }

  changePage(page: number) {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.page = page;
    this.loadInterventions();
  }

  /************************************** */

  cardWidth = 127;  // largeur fixe des cartes
  cardHeight = 200; // hauteur fixe des cartes

  draggedItem: any = null;
  offset = { x: 0, y: 0 };
  dragging = false;

  startDrag(event: MouseEvent, item: any) {
    event.stopPropagation();
    event.preventDefault();
    this.draggedItem = item;
    this.dragging = true;

    // initialise la position si pas déjà
    item.position = item.position || { x: 0, y: 0 };

    // calcul de l’offset pour un drag fluide
    this.offset.x = event.clientX - item.position.x;
    this.offset.y = event.clientY - item.position.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging && this.draggedItem) {
      this.draggedItem.position.x = event.clientX - this.offset.x;
      this.draggedItem.position.y = event.clientY - this.offset.y;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
    this.draggedItem = null;
  }

  goToInterventions() {
    this.router.navigate(['/interventions/list']);
  }

  deleteItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) {
      // Remplacer l'élément par null pour garder la place vide
      bloc[index] = null;
    }
  }

  duplicateItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) {
      // Créer une copie de l'objet (shallow copy suffisant ici)
      const newItem = { ...item };

      // Si tu veux éviter d'avoir le même id, tu peux générer un id unique
      newItem.id = this.generateUniqueId();

      // Insérer la copie juste après l'original
      bloc.splice(index + 1, 0, newItem);
    }
  }

  // Fonction pour générer un id unique (exemple simple)
  generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

}
