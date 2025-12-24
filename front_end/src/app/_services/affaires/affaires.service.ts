import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffairesService {

  constructor(private http: HttpClient) { }

  create(record: any) {
    return this.http.post<any>(environment.url_affaire + '/affaires', record)
  }

  update(id: number, record: any) {
  return this.http.put(`${environment.url_affaire}/affaires/${id}`, record);
}

  getAll() {
    return this.http.get(environment.url_affaire + '/affaires')
  }

  getItemById(id: number) {
    return this.http.get<any>(environment.url_affaire + '/affaires/' + id )
  }

  delete(id: any) {
    return this.http.delete(environment.url_affaire + '/affaires/' + id)
  }
}
