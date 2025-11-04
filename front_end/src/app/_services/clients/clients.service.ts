import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs'; // <-- important

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(environment.url_client + '/clients', record)
  }

  update(record: any) {
    return this.http.put(environment.url_client + '/clients/' + record.id, record)
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(environment.url_client + '/clients/')
  }

  getAllClientsWithContacts(): Observable<any[]> {
    return this.http.get<any[]>(environment.url_client + '/clients/contacts')
  }

  getItemById(id: number) {
    return this.http.get<any>(environment.url_client + '/clients/' + id)
  }

  getRecordDetails(id: number) {
    return this.http.get<any>(environment.url_client + '/clients/details/' + id)
  }

  delete(id: any) {
    return this.http.delete(environment.url_client + '/clients/' + id)
  }
}
