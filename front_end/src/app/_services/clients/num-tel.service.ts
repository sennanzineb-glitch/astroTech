import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NumTelService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(environment.url_client + '/clients/num_tel', record)
  }

  update(record: any) {
    return this.http.put(environment.url_client + '/clients/num_tel/' + record.id, record)
  }

  getAll() {
    return this.http.get(environment.url_client + '/clients/num_tel')
  }

  getItemById(id: number) {
    return this.http.get<any>(environment.url_client + '/clients/num_tel/' + id )
  }

  delete(id: any) {
    return this.http.delete(environment.url_client + '/clients/num_tel/' + id)
  }
}
