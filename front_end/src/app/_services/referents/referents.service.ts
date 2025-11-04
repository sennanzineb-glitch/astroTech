import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferentsService {

  constructor(private http: HttpClient) { }

    create(record: any) {
      return this.http.post<any>(environment.url_referent + '/referents/', record)
    }
  
    update(record: any, id: any) {
      return this.http.put(environment.url_referent + '/referents/' + id, record, id)
    }
  
    getAll() {
      return this.http.get(environment.url_referent + '/referents/')
    }
  
    getItemById(id: number) {
      return this.http.get<any>(environment.url_referent + '/referents/' + id)
    }
  
    delete(id: any) {
      return this.http.delete(environment.url_referent + '/referents/' + id)
    }
}
