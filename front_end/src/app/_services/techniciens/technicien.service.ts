import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(environment.url_technicien + '/techniciens/', record)
  }

  update(record: any, id: any) {
    return this.http.put(environment.url_technicien + '/techniciens/' + id, record, id)
  }

  getAll() {
    return this.http.get(environment.url_technicien + '/techniciens')
  }

  getItemById(id: number) {
    return this.http.get<any>(environment.url_technicien + '/techniciens/' + id)
  }

  delete(id: any) {
    return this.http.delete(environment.url_technicien + '/techniciens/' + id)
  }
}
