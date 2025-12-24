import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NumTelService {

  private baseUrl = `${environment.url_client}/clients/num_tel`;

  constructor(private http: HttpClient) { }

  /** Créer un numéro */
  create(record: any) {
    return this.http.post<any>(`${this.baseUrl}`, record);
  }

  /** Mettre à jour un numéro */
  update(record: any) {
    return this.http.put(`${this.baseUrl}/${record.id}`, record);
  }

  /** Récupérer tous les numéros */
  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  /** Récupérer un numéro par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer un numéro */
  delete(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Vérifie si un numéro existe pour un contact donné */
  getByTelAndContact(contact_id: number, tel: string) {
    return this.http.get(`${this.baseUrl}/byTel/${contact_id}?tel=${encodeURIComponent(tel)}`);
  }
}
