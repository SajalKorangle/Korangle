import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { reportError, ERROR_SOURCES } from './app/services/modules/errors/error-reporting.service';

import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

window.onerror = (message, source, lineno, colno, error) => {
    reportError(
        ERROR_SOURCES[1],
        location.pathname + location.search,
        JSON.stringify({ message, source, lineno, colno, error }),
        'from window.onerror',
        true
    );
    return false;
};
