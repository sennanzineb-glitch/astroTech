import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdresseEmailService {

  private baseUrl = `${environment.url_client}/clients/adresse_email`;

  constructor(private http: HttpClient) { }

  /** Créer un email */
  create(record: any) {
    return this.http.post<any>(`${this.baseUrl}/`, record);
  }

  /** Mettre à jour un email */
  update(record: any) {
    return this.http.put(`${this.baseUrl}/${record.id}`, record);
  }

  /** Récupérer tous les emails */
  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}/`);
  }

  /** Récupérer un email par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer un email par id */
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Vérifie si un email existe pour un contact donné */
  getByEmailAndContact(contact_id: number, email: string) {
    return this.http.get(
      `${this.baseUrl}/byEmail/${contact_id}?email=${encodeURIComponent(email)}`
    );
  }
}
