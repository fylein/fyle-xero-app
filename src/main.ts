import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';

const hostname = window.location.hostname;
const env = hostname.substring(0, hostname.indexOf('.'));

if (environment.sentry_dsn) {
  Sentry.init({
    dsn: environment.sentry_dsn,
    release: environment.release,
    environment : env,
    ignoreErrors: [
      'Non-Error exception captured'
    ],
    tracesSampleRate: 0.5,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
