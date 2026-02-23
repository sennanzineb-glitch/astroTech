import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecteurService {

  private baseUrl = environment.url_client + '/clients/secteur';

  constructor(private http: HttpClient) { }

  /** Créer un secteur */
  create(record: any) {
    return this.http.post<any>(this.baseUrl, record);
  }

  /** Mettre à jour un secteur par id */
  update(record: any) {
    return this.http.put<any>(`${this.baseUrl}/${record.id}`, record);
  }

  /** Mettre à jour uniquement la note du secteur */
  updateNote(id: number, note: string) {
    return this.http.put<any>(`${this.baseUrl}/${id}/note`, { note });
  }

  /** Récupérer tous les secteurs */
  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Récupérer un secteur par id */
  getItemById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer un secteur par id */
  delete(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /** Récupérer les détails d’un secteur */
  getRecordDetails(id: number) {
    return this.http.get<any>(`${this.baseUrl}/details/${id}`);
  }
}
