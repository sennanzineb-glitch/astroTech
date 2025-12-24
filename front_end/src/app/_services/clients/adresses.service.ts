import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  private baseUrl = `${environment.url_client}/clients/adresse`;

  constructor(private http: HttpClient) { }

  /** Créer une adresse */
  create(record: any) {
    return this.http.post<any>(`${this.baseUrl}`, record);
  }

  /** Mettre à jour une adresse */
  update(record: any) {
    return this.http.put(`${this.baseUrl}/${record.id}`, record);
  }

  /** Récupérer toutes les adresses */
  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  /** Récupérer une adresse par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer une adresse par id */
  delete(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
