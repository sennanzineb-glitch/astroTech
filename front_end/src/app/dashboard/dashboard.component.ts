import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
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
  etat?: string;
  position?: { x: number; y: number };
  width?: number; // Stockage crucial de la largeur
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
    private router: Router,
    private cdr: ChangeDetectorRef
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

  startDrag(event: MouseEvent, item: CardItem) {
    event.preventDefault();
    event.stopPropagation();

    const target = (event.target as HTMLElement).closest('.card-custom') as HTMLElement;
    if (!target) return;

    // 1. Capture de la taille réelle calculée par Bootstrap
    const rect = target.getBoundingClientRect();
    
    this.draggedItem = item;
    this.dragging = true;

    // 2. Verrouillage de la largeur en pixels
    this.draggedItem.width = rect.width;
    this.draggedItem.position = { x: rect.left, y: rect.top };

    // 3. Offset pour éviter le "saut" du curseur
    this.offset.x = event.clientX - rect.left;
    this.offset.y = event.clientY - rect.top;

    document.body.classList.add('cursor-grabbing');
    this.cdr.detectChanges();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging && this.draggedItem) {
      this.draggedItem.position = {
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y
      };
      this.cdr.detectChanges();
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.dragging) {
      this.dragging = false;
      if (this.draggedItem) {
        this.draggedItem.position = undefined;
        this.draggedItem.width = undefined;
      }
      this.draggedItem = null;
      document.body.classList.remove('cursor-grabbing');
      this.cdr.detectChanges();
    }
  }

  // Fonctions utilitaires existantes
  getEtatFromBg(bg: string): string {
    const mapping: any = { 'bg-primary': 'PLANIFIÉ', 'bg-warning': 'EN COURS', 'bg-success': 'TERMINÉ' };
    return mapping[bg] || '';
  }

  getEtatClasses(etat: string): string {
    const classes: any = { 'en_cours': 'bg-warning text-dark', 'terminee_avec_succes': 'bg-success', 'planifie': 'bg-primary' };
    return classes[etat] || 'bg-secondary';
  }

  formatEtat(etat: string): string {
    const labels: any = { 'en_cours': 'En cours', 'terminee_avec_succes': 'Terminée', 'planifie': 'Planifié' };
    return labels[etat] || etat;
  }

  openModal(item: CardItem) {
    this.selectedItem = item;
    this.interventions = [];
    this.interventionService.getByTypePaginated(item.type_id, 1, 10, item.etat).subscribe(res => {
      this.interventions = res.data;
    });
    const modal = new bootstrap.Modal(document.getElementById('cardModal'));
    modal.show();
  }

  duplicateItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) bloc.splice(index + 1, 0, { ...item });
  }

  deleteItem(item: any, bloc: any[]) {
    const index = bloc.indexOf(item);
    if (index > -1) bloc.splice(index, 1);
  }

  goToInterventions() {
    window.open(this.router.serializeUrl(this.router.createUrlTree(['/interventions/list'])), '_blank');
  }
}