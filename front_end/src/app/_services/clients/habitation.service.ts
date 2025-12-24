import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitationService {

  private baseUrl = environment.url_client + '/clients/habitation';

  constructor(private http: HttpClient) { }

  /** Créer une habitation */
  create(record: any) {
    return this.http.post<any>(this.baseUrl, record);
  }

  /** Mettre à jour une habitation par id */
  update(record: any) {
    return this.http.put<any>(`${this.baseUrl}/${record.id}`, record);
  }

  /** 🔹 Nouvelle méthode pour mettre à jour uniquement la note */
  updateNote(id: number, note: string) {
    return this.http.put(`${this.baseUrl}/${id}/note`, { note });
  }

  /** Récupérer toutes les habitations */
  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Récupérer une habitation par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer une habitation par id */
  delete(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
  /** Récupérer les détails d’une habitation */
  getRecordDetails(id: number) {
    return this.http.get<any>(`${this.baseUrl}/details/${id}`);
  }
}
