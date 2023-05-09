import { importProvidersFrom, isDevMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import appRoutes from './app/app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { setBasePath } from '@shoelace-style/shoelace';

setBasePath('/shoelace/dist/');

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    MatSnackBar,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}).catch((err) => console.error(err));
