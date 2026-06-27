import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WidgetConfig {
  id: number;
  title: string;
  category: 'affaire' | 'intervention' | 'message' | 'notification';
  display_type: 'number' | 'pie' | 'bar' | 'line';
  color: string;
  
  // Ajoutez un "?" pour rendre ces propriétés optionnelles en Front-end
  dashboard_id?: number; 
  data_type?: string;
  filters?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WidgetService{
  private apiUrl = environment.apiUrl_dashboard;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les vignettes configurées pour un tableau de bord spécifique
  getWidgets(dashboardId: number): Observable<WidgetConfig[]> {
    return this.http.get<WidgetConfig[]>(`${this.apiUrl}/${dashboardId}/widgets`);
  }

  // Créer une nouvelle vignette dans un tableau de bord
  createWidget(dashboardId: number, widgetData: Partial<WidgetConfig>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${dashboardId}/widgets`, widgetData);
  }

  // Récupérer les valeurs et données statistiques réelles de chaque vignette
  getDashboardStats(dashboardId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${dashboardId}/stats`);
  }

  /**
   * Supprimer un widget spécifique d'un tableau de bord
   * @param dashboardId Identifiant de la configuration globale
   * @param widgetId Identifiant unique du widget à effacer
   */
  deleteWidget(dashboardId: number, widgetId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${dashboardId}/widgets/${widgetId}`);
  }
}