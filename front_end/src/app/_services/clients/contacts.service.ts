import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private baseUrl = `${environment.url_client}/clients/contact`;

  constructor(private http: HttpClient) { }

  /** Créer un contact */
  create(record: any) {
    return this.http.post<any>(`${this.baseUrl}`, record);
  }

  /** Mettre à jour un contact */
  update(record: any) {
    return this.http.put(`${this.baseUrl}/${record.id}`, record);
  }

  /** Récupérer tous les contacts */
  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  /** Récupérer un contact par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer un contact */
  delete(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** 🔹 Obtenir un contact par type + ID + nom + poste */
  getByNameAndPoste(record: { type: string; id: number; nom_complet: string; poste: string }) {
    return this.http.get(`${this.baseUrl}/byNameAndPoste`, {
      params: {
        type: record.type,
        id: record.id.toString(),
        nom_complet: record.nom_complet,
        poste: record.poste
      }
    });
  }
}
