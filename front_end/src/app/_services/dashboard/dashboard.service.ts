import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Dashboard {
  id: number;
  user_id: number;
  name: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl_dashboard;

  constructor(private http: HttpClient) {}

  // Récupérer tous les tableaux de bord de l'utilisateur connecté
  getDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(this.apiUrl);
  }

  // Créer un nouveau tableau de bord
  createDashboard(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name });
  }

  // Supprimer un tableau de bord (et ses vignettes associées via CASCADE)
  deleteDashboard(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}