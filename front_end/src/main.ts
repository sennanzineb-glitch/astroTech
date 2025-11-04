import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { TokenInterceptor } from './app/_interceptors/token.interceptor';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([TokenInterceptor])),
    ...appConfig.providers
  ]
});


