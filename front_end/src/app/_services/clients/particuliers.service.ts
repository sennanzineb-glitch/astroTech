import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticuliersService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(`${environment.url_client}/clients/particulier`, record);
  }

  update(record: any) {
    return this.http.put(`${environment.url_client}/clients/particulier/${record.id}`, record);
  }

  /** 🔹 Mettre à jour uniquement la note du particulier */
  updateNote(id: number, note: string) {
    return this.http.put(`${environment.url_client}/clients/particulier/${id}/note`, { note });
  }

  getAll() {
    return this.http.get(`${environment.url_client}/clients/particulier`);
  }

  getItemById(id: number) {
    return this.http.get<any>(`${environment.url_client}/clients/particulier/${id}`);
  }

  delete(id: any) {
    return this.http.delete(`${environment.url_client}/clients/particulier/${id}`);
  }
}
