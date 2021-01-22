import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

window.onerror = (message, source, lineno, colno, error) => {
  (<any>window).ga('send', 'exception', {
      'exDescription': JSON.stringify({ from:'window.onerror', message, source, lineno, colno, error }),
      'exFatal': true
  });
  console.log('Error Reported: window.onerror');
  return false;
}