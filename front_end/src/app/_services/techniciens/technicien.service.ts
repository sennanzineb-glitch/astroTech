import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {

  private baseUrl = `${environment.url_technicien}/techniciens`;

  constructor(private http: HttpClient) { }

  /** Créer un technicien */
  create(record: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, record);
  }

  /** Mettre à jour un technicien */
  update(record: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, record);
  }

  /** Récupérer tous les techniciens (sans pagination) */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  /** Récupérer les techniciens avec pagination et recherche */
  apiGetAllWithPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search
      }
    });
  }

  /** Récupérer un technicien par son ID */
  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Supprimer un technicien */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
