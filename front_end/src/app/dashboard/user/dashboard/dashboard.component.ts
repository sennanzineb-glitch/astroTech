import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WidgetConfig, WidgetService } from '../../../_services/dashboard/widget.service';
import { DashboardChartComponent } from '../pie-chart/pie-chart.component';
import { InterventionService } from '../../../_services/affaires/intervention.service';
import { DashboardService, Dashboard } from '../../../_services/dashboard/dashboard.service'; // Import de Dashboard
import { of, switchMap, catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  widgets: WidgetConfig[] = [];
  statsData: { [key: number]: any } = {};
  
  // GESTION MULTI-DASHBOARD
  dashboards: Dashboard[] = [];
  selectedDashboardId: number = 0; 
  nouveauDashboardName: string = '';

  interventionTypes: any[] = [];

  nouveauWidget: Partial<WidgetConfig> = {
    title: '',
    category: 'intervention',
    data_type: 'all',
    display_type: 'number',
    color: '#3f51b5'
  };

  constructor(
    private widgetService: WidgetService,
    private interventionService: InterventionService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadAllDashboards(true); // Charge les dashboards au démarrage
    this.loadTypes();
  }

  // Récupère tous les dashboards de l'utilisateur
  loadAllDashboards(isInitialLoad: boolean = false): void {
    this.dashboardService.getDashboards().subscribe({
      next: (list: Dashboard[]) => {
        this.dashboards = list;
        
        if (list.length > 0) {
          // Si chargement initial, on sélectionne le premier par défaut
          if (isInitialLoad) {
            this.selectedDashboardId = list[0].id;
            this.loadDashboard(this.selectedDashboardId);
          }
        } else {
          // Si aucun dashboard n'existe du tout, on en crée un par défaut
          this.creerNouveauDashboardEtCharger("Tableau principal");
        }
      },
      error: (err) => console.error('Erreur lors de la récupération des dashboards:', err)
    });
  }

  // Déclenché quand l'utilisateur change de Dashboard dans le <select>
  onDashboardChange(id: number): void {
    this.selectedDashboardId = id;
    this.widgets = [];
    this.statsData = {};
    if (id > 0) {
      this.loadDashboard(id);
    }
  }

  // Ajouter un nouveau Tableau de Bord
  ajouterDashboard(): void {
    if (!this.nouveauDashboardName.trim()) return;

    this.dashboardService.createDashboard(this.nouveauDashboardName.trim()).subscribe({
      next: (res: any) => {
        this.nouveauDashboardName = '';
        // Recharge la liste globale et sélectionne le nouveau
        this.dashboardService.getDashboards().subscribe((list: Dashboard[]) => {
          this.dashboards = list;
          // On cherche l'ID du dashboard qu'on vient de créer (généralement le dernier ou via la réponse de l'API)
          const créé = list.find(d => d.name === res.name) || res;
          if (créé && créé.id) {
            this.selectedDashboardId = créé.id;
            this.onDashboardChange(créé.id);
          }
        });
      },
      error: (err) => console.error('Erreur lors de la création du dashboard:', err)
    });
  }

  private creerNouveauDashboardEtCharger(nom: string): void {
    this.dashboardService.createDashboard(nom).subscribe({
      next: (dashboardRes: any) => {
        if (dashboardRes && dashboardRes.id) {
          this.selectedDashboardId = dashboardRes.id;
          this.loadAllDashboards();
        }
      },
      error: (err) => console.error('Impossible de créer un tableau de bord de secours:', err)
    });
  }

  loadDashboard(id: number): void {
    this.widgetService.getWidgets(id).subscribe({
      next: (config: WidgetConfig[]) => {
        this.widgets = config;
        this.loadStats(id);
      },
      error: (err) => console.error('Erreur lors du chargement des widgets:', err)
    });
  }

  loadStats(id: number): void {
    this.widgetService.getDashboardStats(id).subscribe({
      next: (stats) => {
        if (stats) {
          Object.keys(stats).forEach(key => {
            this.cleanStatsLabels(stats, Number(key));
          });
        }
        this.statsData = { ...stats };
      },
      error: (err) => console.error('Erreur lors du chargement des statistiques:', err)
    });
  }

  loadSingleWidgetStats(dashboardId: number, widgetId: number): void {
    this.widgetService.getDashboardStats(dashboardId).subscribe({
      next: (stats) => {
        if (stats && stats[widgetId]) {
          this.cleanStatsLabels(stats, widgetId);
          this.statsData = {
            ...this.statsData,
            [widgetId]: stats[widgetId]
          };
        }
      },
      error: (err) => console.error('Erreur lors du chargement des stats du nouveau widget:', err)
    });
  }

  private cleanStatsLabels(stats: any, key: number): void {
    if (stats[key] && stats[key].labels) {
      stats[key].labels = stats[key].labels.map((label: string) => {
        if (!label) return '';
        let cleanLabel = label.trim();
        if (cleanLabel.startsWith(',')) {
          cleanLabel = cleanLabel.substring(1).trim();
        }
        return cleanLabel.length > 15 ? cleanLabel.substring(0, 15) + '...' : cleanLabel;
      });
    }
  }

  getChartData(widgetId: number | undefined): Array<{ label: string, value: number }> {
    if (!widgetId || !this.statsData[widgetId]) return [];
    
    const widgetStats = this.statsData[widgetId];
    if (Array.isArray(widgetStats)) return widgetStats;
    
    if (widgetStats.labels && (widgetStats.data || widgetStats.values)) {
      const values = widgetStats.data || widgetStats.values;
      return widgetStats.labels.map((lbl: string, index: number) => ({
        label: lbl,
        value: values[index] || 0
      }));
    }
    return [];
  }

  creerWidget(): void {
    if (!this.nouveauWidget.title || !this.selectedDashboardId) return;

    const widgetAEnregistrer: Partial<WidgetConfig> = {
      title: this.nouveauWidget.title,
      category: this.nouveauWidget.category,
      display_type: this.nouveauWidget.display_type,
      color: this.nouveauWidget.color || '#3f51b5',
      dashboard_id: this.selectedDashboardId, // Lié au dashboard sélectionné
      data_type: this.nouveauWidget.data_type
    };

    this.widgetService.createWidget(this.selectedDashboardId, widgetAEnregistrer).pipe(
      catchError((error) => {
        console.error("Erreur d'insertion du widget", error);
        return of(null);
      })
    ).subscribe({
      next: (widgetResponse: any) => {
        if (widgetResponse && widgetResponse.id) {
          this.widgets.push(widgetResponse);
          this.loadSingleWidgetStats(this.selectedDashboardId, widgetResponse.id);
        }
        this.resetFormulaire();
      }
    });
  }

  supprimerWidget(widgetId: number | undefined): void {
    if (!widgetId) return;

    if (confirm('Voulez-vous vraiment supprimer ce widget ?')) {
      this.widgetService.deleteWidget(this.selectedDashboardId, widgetId).subscribe({
        next: () => {
          this.widgets = this.widgets.filter(w => w.id !== widgetId);
          const updatedStats = { ...this.statsData };
          delete updatedStats[widgetId];
          this.statsData = updatedStats;
        },
        error: (err) => console.error('Erreur lors de la suppression du widget:', err)
      });
    }
  }

  resetFormulaire(): void {
    this.nouveauWidget = {
      title: '',
      category: 'intervention',
      data_type: 'all',
      display_type: 'number',
      color: '#3f51b5'
    };
  }

  loadTypes(): void {
    this.interventionService.getInterventionTypes().subscribe({
      next: (res: any) => {
        this.interventionTypes = res.data || res;
      },
      error: (err) => console.error('Erreur chargement types interventions:', err)
    });
  }

  onConditionChange(): void {
    if (this.nouveauWidget.category === 'intervention') {
      if (this.nouveauWidget.display_type === 'number') {
        if (this.nouveauWidget.data_type !== 'technicien' && this.nouveauWidget.data_type !== 'technicien_prevu') {
          this.nouveauWidget.data_type = 'all';
        }
      } else {
        this.nouveauWidget.data_type = 'etat';
      }
    } else {
      this.nouveauWidget.data_type = this.nouveauWidget.category;
    }
  }
}