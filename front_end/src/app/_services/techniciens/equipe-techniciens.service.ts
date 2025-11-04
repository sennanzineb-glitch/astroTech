import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipeTechniciensService {

    constructor(private http: HttpClient) {}

    //return this.http.post<any>(environment.url_technicien + '/techniciens/', record)

  // 🟩 Créer une équipe
  createEquipe(equipeData: any) {
    return this.http.post(environment.url_technicien + '/techniciens/equipe', equipeData);
  }

  // 🟨 Mettre à jour une équipe
  updateEquipe(id: number, equipeData: any){
    return this.http.put(environment.url_technicien +'/techniciens/equipe/'+id, equipeData);
  }

  // 🟥 Supprimer une équipe
  delete(id: number){
    return this.http.delete(environment.url_technicien +'/techniciens/equipe/'+id);
  }

  // 🟦 Récupérer toutes les équipes
  getAllEquipes() {
    return this.http.get<any[]>(environment.url_technicien + '/techniciens/equipe');
  }

  // 🟪 Récupérer une équipe par ID
  getEquipeById(id: number){
    return this.http.get(environment.url_technicien +'/techniciens/equipe/'+id);
  }

  // 🟧 Ajouter un technicien à une équipe
  addTechnicienToEquipe(id: number, technicienId: number){
    return this.http.put(environment.url_technicien +'/techniciens/equipe/'+id+'/ajouter-technicien', { technicienId });
  }

  // 🟫 Retirer un technicien d’une équipe
  removeTechnicienFromEquipe(technicienId: number){
    return this.http.put(environment.url_technicien +'/techniciens/equipe/retirer-technicien/'+technicienId, {});
  }

  // ⚪ Changer le chef d’équipe
  changeChefEquipe(id: number, chefId: number){
    return this.http.put(environment.url_technicien +'/techniciens/equipe/'+id+'/change-chef', { chefId });
  }
}
