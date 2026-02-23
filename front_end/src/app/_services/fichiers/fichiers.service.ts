import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Interface Fichier (sans décorateur)
export interface Fichier {
  id?: number;
  nom: string;
  chemin: string;
  taille: number;
  type: string;
  date_upload?: string;
  idReferent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FichiersService {
  constructor(private http: HttpClient) { }

  // 🔹 Lister tous les fichiers
  getAll(): Observable<Fichier[]> {
    return this.http.get<Fichier[]>(environment.url_fichier + '/fichiers');
  }

 // 🔹 Récupérer tous les fichiers by Referent
  getRecordsByReferent(id: number) {
    return this.http.get<Fichier[]>(environment.url_fichier + '/fichiers/referent/'+id);
  }

   // 🔹 Lister tous les fichiers
  getFichiersBy(): Observable<Fichier[]> {
    return this.http.get<Fichier[]>(environment.url_fichier + '/fichiers');
  }

  // 🔹 Supprimer un fichier par ID
  deleteById(id: number): Observable<any> {
    return this.http.delete(environment.url_fichier + '/fichiers/' + id);
  }

  // Upload multiple fichiers avec FormData
  uploadFiles(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<any>(environment.url_fichier + '/fichiers/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
