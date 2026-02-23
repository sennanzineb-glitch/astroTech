import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const token = localStorage.getItem('token'); // récupérer le token JWT
  const router = inject(Router); // injecter le router pour redirection

  // Cloner la requête et ajouter le header Authorization si token présent
  const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  // Gérer la réponse
  return next(cloned).pipe(
    catchError(err => {
      if (err.status === 401) {
        localStorage.removeItem('token'); // supprimer token expiré
        router.navigate(['/login']); // rediriger vers login
      }
      return throwError(() => err);
    })
  );
};
