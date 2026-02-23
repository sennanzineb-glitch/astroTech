import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferentsService {

  private baseUrl = environment.url_referent + '/referents';

  constructor(private http: HttpClient) { }

  // Créer un nouveau référent
  create(record: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/', record);
  }

  // Mettre à jour un référent existant
  update(record: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, record);
  }

  // Récupérer tous les référents (non paginés)
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Récupérer les référents avec pagination et recherche
  apiGetAllWithPaginated(page: number = 1, limit: number = 10, search: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search
      }
    });
  }

  // Récupérer un référent par ID
  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Supprimer un référent
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
