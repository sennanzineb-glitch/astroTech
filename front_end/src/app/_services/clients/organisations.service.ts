import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganisationsService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(`${environment.url_client}/clients/organisation`, record);
  }

  update(record: any) {
    return this.http.put(`${environment.url_client}/clients/organisation/${record.id}`, record);
  }

  /** 🔹 Nouvelle méthode pour mettre à jour uniquement la note */
  updateNote(id: number, note: string) {
    return this.http.put(`${environment.url_client}/clients/organisation/${id}/note`, { note });
  }

  getAll() {
    return this.http.get(`${environment.url_client}/clients/organisation`);
  }

  getItemById(id: number) {
    return this.http.get<any>(`${environment.url_client}/clients/organisation/${id}`);
  }

  delete(id: any) {
    return this.http.delete(`${environment.url_client}/clients/organisation/${id}`);
  }
}
