import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../_globale/shared/shared.module';
import { DashboardService } from '../_services/affaires/dashboard.service';
import { InterventionService } from '../_services/affaires/intervention.service';

declare var bootstrap: any;

interface CardItem {
  type_id: number;
  title: string;
  count: number;
  bg: string;
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
    private interventionService: InterventionService
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

}
