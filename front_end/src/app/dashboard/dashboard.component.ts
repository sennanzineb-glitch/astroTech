import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from '../_globale/shared/shared.module';
import { DashboardService } from '../_services/affaires/dashboard.service';
import { InterventionService } from '../_services/affaires/intervention.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

// ... (imports identiques)

interface CardItem {
  type_id: number;
  title: string;
  count: number;
  bg: string;
  id?: string;
  etat?: string;
  position?: { x: number; y: number };
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
  leftBlocs: CardItem[][] = [];
  rightBlocs: CardItem[][] = [];
  interventions: any[] = [];

  showLeft = true;
  showRight = true;
  draggedItem: CardItem | null = null;
  offset = { x: 0, y: 0 };
  dragging = false;

  constructor(
    private dashboardService: DashboardService,
    private interventionService: InterventionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.getInterventionsDashboard().subscribe(response => {
      this.dashboard = response.data ?? response;
      this.buildDashboard();
    });
  }

  buildDashboard(): void {
    this.leftBlocs = this.buildBlocs(this.dashboard['Auto-contrôle']);
    const travaux = this.buildBlocs(this.dashboard['Travaux principaux']);
    const quitus = this.buildBlocs(this.dashboard['Quitus']);
    this.rightBlocs = [...quitus, ...travaux];
  }

  buildBlocs(groupData: any): CardItem[][] {
    if (!groupData) return [];
    return Object.keys(groupData).map(type => {
      const etats = groupData[type];
      return [
        { type_id: etats.type_id, title: type, count: etats.PLANIFIE || 0, etat: 'planifie', bg: 'bg-primary' },
        { type_id: etats.type_id, title: type, count: etats.EN_COURS || 0, etat: 'en_cours', bg: 'bg-warning' },
        { type_id: etats.type_id, title: type, count: etats.TERMINE || 0, etat: 'terminee_avec_succes', bg: 'bg-success' }
      ];
    });
  }

  openModal(item: CardItem) {
    this.selectedItem = item;
    this.interventions = []; // Reset avant chargement
    this.loadInterventions();

    const modalElement = document.getElementById('cardModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  loadInterventions() {
    if (!this.selectedItem) return;
    console.log(this.selectedItem);

    //const etatBackend = this.normalizeEtat(this.getEtatFromBg(this.selectedItem.bg));

    this.interventionService.getByTypePaginated(this.selectedItem.type_id, 1, 10, this.selectedItem.etat)
      .subscribe(res => {
        this.interventions = res.data;
      });
  }

  getEtatFromBg(bg: string): string {
    const mapping: any = { 'bg-primary': 'PLANIFIÉ', 'bg-warning': 'EN COURS', 'bg-success': 'TERMINÉ' };
    return mapping[bg] || '';
  }

  normalizeEtat(etat: string): string {
    const mapping: any = { 'PLANIFIÉ': 'planifie', 'EN COURS': 'en_cours', 'TERMINÉ': 'terminee' };
    return mapping[etat] || etat.toLowerCase();
  }

  // --- Drag & Drop ---
  startDrag(event: MouseEvent, item: CardItem) {
    event.stopPropagation();
    this.draggedItem = item;
    this.dragging = true;
    item.position = item.position || { x: 0, y: 0 };
    this.offset.x = event.clientX - item.position.x;
    this.offset.y = event.clientY - item.position.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging && this.draggedItem && this.draggedItem.position) {
      this.draggedItem.position.x = event.clientX - this.offset.x;
      this.draggedItem.position.y = event.clientY - this.offset.y;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
    this.draggedItem = null;
  }

  deleteItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) bloc[index] = null;
  }

  duplicateItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      bloc.splice(index + 1, 0, newItem);
    }
  }

  goToInterventions() {
    // 1. Génère l'URL complète
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/interventions/list'])
    );

    // 2. Ouvre cette URL dans un nouvel onglet
    window.open(url, '_blank');
  }

  // Couleur Bootstrap en fonction du statut
  getEtatClasses(etat: string): string {
    switch (etat) {
      case 'en_cours':
      case 'trajet_en_cours':       // ajouté
        return 'bg-warning text-dark';
      case 'terminee':
      case 'terminee_avec_succes':
        return 'bg-success';
      case 'terminee_avec_interruption':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Icône Bootstrap selon le statut
  getEtatIcon(etat: string): string {
    switch (etat) {
      case 'en_cours':
      case 'trajet_en_cours':       // ajouté
        return 'bi-hourglass-split';
      case 'terminee':
      case 'terminee_avec_succes':
        return 'bi-check-circle';
      case 'terminee_avec_interruption':
        return 'bi-x-circle';
      default:
        return '';
    }
  }

  // Texte lisible pour chaque statut
  formatEtat(etat: string): string {
    switch (etat) {
      case 'en_cours':
        return 'En cours';
      case 'trajet_en_cours':       // ajouté
        return 'Trajet en cours';
      case 'terminee':
        return 'Terminée';
      case 'terminee_avec_succes':
        return 'Terminée avec succès';
      case 'terminee_avec_interruption':
        return 'Interrompue';
      default:
        return etat.charAt(0).toUpperCase() + etat.slice(1);
    }
  }

}
