import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './app/_interceptors/token.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// ✅ ENREGISTRER LE LOCALE FRANÇAIS
registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes),

    DatePipe, // ✅ Fournit DatePipe globalement

    { provide: LOCALE_ID, useValue: 'fr-FR' } // ✅ Définir la langue globale
  ]
})
.catch(err => console.error(err));
