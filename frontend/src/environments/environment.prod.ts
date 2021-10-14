// This file will be override by environment.prod.ts during production build

export const environment = {
    production: true,
    versionCheckURL: 'www.korangle.com/version.json',
    DJANGO_SERVER: 'https://www.korangle.com:8443',
    api_version: '/v2.0',
};