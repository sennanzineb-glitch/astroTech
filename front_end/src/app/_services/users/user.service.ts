import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Centralisation de l'URL de base définie dans votre environnement
  private baseUrl = environment.apiUrl_user;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer tous les utilisateurs (pour le tableau de bord)
   * GET `${URI}/all`
   */
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all`);
  }

  /**
 * Récupérer uniquement les utilisateurs ayant le rôle 'user' (les clients)
 * GET `${URI}/clients`
 */
  getOnlyUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/clients`);
  }

  /**
   * Récupérer les statistiques des comptes
   * GET `${URI}/stats`
   */
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }

  /**
   * 3. Ajouter un nouvel utilisateur
   * POST `${URI}/add`
   * @param userData Objet contenant { full_name, email, role, password_hash }
   */
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, userData);
  }

  /**
   * Modifier les informations d'un utilisateur
   * PUT `${URI}/:id`
   * @param id Identifiant de l'utilisateur
   * @param updateData Objet contenant les champs modifiés { full_name, email, role }
   */
  updateUser(id: number | string, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, updateData);
  }

  /**
   * Activer ou Bloquer un utilisateur (Switch de statut)
   * PATCH `${URI}/:id/status`
   * @param id Identifiant de l'utilisateur
   * @param isActive Booléen (true pour actif, false pour bloqué)
   */
  toggleStatus(id: number | string, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, { is_active: isActive });
  }

  /**
   * Modifier le mot de passe d'un utilisateur
   * PATCH `${URI}/:id/password`
   * @param id Identifiant de l'utilisateur
   * @param newPassword Nouveau mot de passe (hashé de préférence)
   */
  updatePassword(id: number | string, newPassword: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/password`, { newPassword: newPassword });
  }

  /**
   * Supprimer définitivement un utilisateur
   * DELETE `${URI}/:id`
   * @param id Identifiant de l'utilisateur à supprimer
   */
  deleteUser(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}