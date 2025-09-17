import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { routes } from './app.routes';
import { coreProviders } from './core/core.config';
import { environment } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ...coreProviders
,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.CAPTCHA_KEY } as RecaptchaSettings,
    },
  ]
}
