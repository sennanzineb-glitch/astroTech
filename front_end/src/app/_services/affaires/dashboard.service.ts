import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.url_affaire + '/affaires/dashboard/interventions';
  
  constructor(private http: HttpClient) { }

  getInterventionsDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

}
