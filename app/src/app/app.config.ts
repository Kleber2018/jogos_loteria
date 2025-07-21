import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
registerLocaleData(localePt)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    {
        provide: LOCALE_ID,
        useValue: 'pt-BR'
    },
    {
        provide:  DEFAULT_CURRENCY_CODE,
        useValue: 'BRL'
    },
    provideHttpClient(), 
  ]


  
};
