// environment.ts file will be overridden by this file during mobile testing build

/*
backend/test_mobile_backend.sh      //start backend for mobile testing
frontend/test_mobile_frontend.sh    //start frontend for mobile testing
*/


export const environment = {
    production: false,
    versionCheckURL: 'www.korangle.com/version.json',
    DJANGO_SERVER: 'http://' + window.location.hostname + ':8000', //for mobile + normal debugging over LAN
    api_version: '/v2.0',
};
