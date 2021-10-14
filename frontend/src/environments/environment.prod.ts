// This file will be override by environment.prod.ts during production build

export const environment = {
    production: true,
    versionCheckURL: 'www.korangle.com/version.json',
    DJANGO_SERVER: 'http://localhost:8000', // normal debugging only (localhost)
    api_version: '/v2.0',
};
