import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

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
    integrations: [new TracingIntegrations.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    })],
    tracesSampleRate: 0.1,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
