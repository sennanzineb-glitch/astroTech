import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Redirection par défaut vers /login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Pages publiques
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Pages avec layout (protégées)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // 🔐 protège toutes les routes enfants
        children: [
            /** Affaires **/
            { path: 'affaires/edit', loadComponent: () => import('./affaires/edit/edit/edit.component').then(c => c.EditComponent) },
            { path: 'affaires/list', loadComponent: () => import('./affaires/list/list.component').then(c => c.ListComponent) },

            /** Clients **/
            { path: 'clients/list', loadComponent: () => import('./clients/list/list.component').then(c => c.ListComponent) },

            /** Techniciens **/
            { path: 'techniciens/list', loadComponent: () => import('./techniciens/list/list.component').then(c => c.ListComponent) },
            { path: 'techniciens/edit', loadComponent: () => import('./techniciens/edit/edit.component').then(c => c.EditComponent) },
            { path: 'techniciens/edit/:id', loadComponent: () => import('./techniciens/edit/edit.component').then(c => c.EditComponent) },
            { path: 'techniciens/equipe', loadComponent: () => import('./techniciens/equipe/equipe.component').then(c => c.EquipeComponent) },

             /** Referents **/
            { path: 'referents/list', loadComponent: () => import('./referents/list/list.component').then(c => c.ListComponent) },
            { path: 'referents/edit', loadComponent: () => import('./referents/edit/edit.component').then(c => c.EditComponent) },
            { path: 'referents/edit/:id', loadComponent: () => import('./referents/edit/edit.component').then(c => c.EditComponent) },
        
        ]
    },

    // Page 404 (facultative)
    { path: '**', redirectTo: 'login' }

];