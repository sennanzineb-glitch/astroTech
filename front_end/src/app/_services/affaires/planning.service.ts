import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

    constructor(private http: HttpClient) { }

  // 🔹 Ajouter une planification pour une intervention
  addPlanning(interventionId: number, planning: { date: string; heure: string }){
    return this.http.post(`${environment.url_affaire}/affaires/interventions/${interventionId}/planning`, planning);
  }

  // 🔹 Récupérer toutes les planifications
  getAll() {
    return this.http.get(`${environment.url_affaire}/affaires/planning`);
  }

  // 🔹 Modifier une planification
  updatePlanning(id: number, planning: { date: string; heure: string }){
    return this.http.put(`${environment.url_affaire}/affaires/planning/${id}`, planning);
  }

  // 🔹 Supprimer une planification
  deletePlanning(id: number){
    return this.http.delete(`${environment.url_affaire}/affaires/planning/${id}`);
  }
}
