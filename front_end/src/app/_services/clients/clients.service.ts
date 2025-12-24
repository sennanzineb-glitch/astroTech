import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
    return this.http.get<any[]>(`${this.API_URL}/contacts`);
  }

  getClientsByParentWithDetails(parentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/parent/${parentId}`);
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
}
