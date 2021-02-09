// This file will be override by environment.prod.ts during production build

export const environment = {
    production: false,
    versionCheckURL: 'www.korangle.com/version.json',
    DJANGO_SERVER: 'http://localhost:8000', // normal
    //DJANGO_SERVER: 'http://10.0.2.2:8000', // for mobile debugging
    api_version: '/v2.0',
};
