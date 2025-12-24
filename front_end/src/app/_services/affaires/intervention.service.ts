import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private baseUrl = environment.url_affaire + '/affaires/interventions';

  constructor(private http: HttpClient) {}

  /** Ajouter une intervention (FormData autorisé) */
  create(record: any): Observable<any> {
    return this.http.post(this.baseUrl, record);
  }

  /** Modifier une intervention */
  update(id: number, record: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, record);
  }

  /** Récupérer toutes les interventions */
  getAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  /** Récupérer une intervention par ID */
  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  /** Supprimer une intervention */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Obtenir le prochain numéro automatique */
  getNextNumero(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextNumero`);
  }

  /** Assigner techniciens à une intervention */
  assignTechniciens(interventionId: number, techniciens: number[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${interventionId}/assign-techniciens`,
      { techniciens }
    );
  }

  /** Ajouter un planning dans une intervention */
  addPlanning(interventionId: number, planning: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${interventionId}/add-planning`,
      planning
    );
  }
}