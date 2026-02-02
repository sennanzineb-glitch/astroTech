import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EquipeTechniciensService {

  private baseUrl = environment.url_technicien + '/techniciens/equipe';

  constructor(private http: HttpClient) { }

  // 🟩 Créer une équipe
  createEquipe(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  // 🟨 Mettre à jour une équipe
  updateEquipe(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // 🟥 Supprimer une équipe
  deleteEquipe(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // 🟦 Récupérer toutes les équipes
  getAllEquipes() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  apiGetAllWithPaginated(page: number = 1, limit: number = 10, search: string = '') {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search
      }
    });
  }

  // 🟪 Récupérer une équipe par ID
  getEquipeById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // 🟧 Ajouter un technicien à une équipe
  addTechnicienToEquipe(equipeId: number, technicienId: number) {
    return this.http.put(`${this.baseUrl}/${equipeId}/ajouter-technicien`, {
      technicienId
    });
  }

  // 🟫 Retirer un technicien d’une équipe
  removeTechnicienFromEquipe(technicienId: number) {
    return this.http.put(`${this.baseUrl}/retirer-technicien/${technicienId}`, {});
  }

  // ⚪ Changer le chef d’équipe
  changeChefEquipe(equipeId: number, chefId: number) {
    return this.http.put(`${this.baseUrl}/${equipeId}/change-chef`, {
      chefId
    });
  }

}
