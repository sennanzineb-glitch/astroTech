import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private readonly API_URL = environment.url_client + '/clients';

  constructor(private http: HttpClient) { }

  create(record: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, record);
  }

  update(record: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${record.id}`, record);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/`);
  }

  getAllClientsWithContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/contacts/all`);
  }

  getAllClientsWithContactsPaginated(page: number = 1, limit: number = 10, search: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/contacts`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search
      }
    });
  }

  getClientsByParentWithDetails(
    parentId: number,
    parentType: string = '',
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<any> {

    const params = {
      parentType, // 👈 NOUVEAU
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {})
    };

    return this.http.get<any>(
      `${this.API_URL}/parent/${parentId}`,
      { params }
    );
  }

  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  getRecordDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/details/${id}`);
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

 
  // async getByClient(clientId: number): Promise<any> {
  //   // 🔹 Convertir Observable en Promise
  //   return await firstValueFrom(
  //     this.http.get(`${this.API_URL}/${clientId}/interventions`)
  //   );
  // }
  

   /**
   * 🔹 Historique des interventions par client
  */
  async getByClient(
    clientId: number,
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<any> {
    // 🔹 Construire les params de requête
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }

    // 🔹 Appel HTTP avec params et conversion en Promise
    return await firstValueFrom(
      this.http.get(`${this.API_URL}/${clientId}/interventions`, { params })
    );
  }

  getAffairesByClient(clientId: number, page: number = 1, limit: number = 10, search: string = ''){
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search.trim() !== '') {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.API_URL}/${clientId}/affaires`, { params });
  }

}
