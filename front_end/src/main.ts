import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './app/_interceptors/token.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // tes routes

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes) // ⚠️ obligatoire si tu utilises Router
  ]
});
