import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffairesService {

  private apiUrl = `${environment.url_affaire}/affaires`;

  constructor(private http: HttpClient) {}

  // ================= CREATE =================
  create(record: any) {
    return this.http.post<any>(this.apiUrl, record);
  }

  // ================= UPDATE =================
  update(id: number, record: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, record);
  }

  // ================= GET ALL (SANS PAGINATION) =================
  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // ================= GET ALL (PAGINATION + SEARCH) =================
  // getAllPaginated(
  //   page: number = 1,
  //   limit: number = 10,
  //   search: string = ''
  // ) {
  //   let params = new HttpParams()
  //     .set('page', page)
  //     .set('limit', limit);

  //   if (search && search.trim() !== '') {
  //     params = params.set('search', search);
  //   }

  //   return this.http.get<any>(this.apiUrl, { params });
  // }


  getAllPaginated(page: number, limit: number, search: string) {
  return this.http.get<any[]>(
    `${environment.url_affaire}/affaires`,
    {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search
      }
    }
  );
}


  // ================= GET BY ID =================
  getItemById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ================= DELETE =================
  delete(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
