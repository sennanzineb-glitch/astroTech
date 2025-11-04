import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdresseEmailService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(environment.url_client + '/clients/adresse_email/', record)
  }

  update(record: any) {
    return this.http.put(environment.url_client + '/clients/adresse_email/' + record.id, record)
  }

  getAll() {
    return this.http.get(environment.url_client + '/clients/adresse_email/')
  }

  getItemById(id: number) {
    return this.http.get<any>(environment.url_client + '/clients/adresse_email/' + id)
  }

  delete(id: any) {
    return this.http.delete(environment.url_client + '/clients/adresse_email/' + id)
  }
}
