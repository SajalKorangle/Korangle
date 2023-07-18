// environment.ts file will be overridden by this file during mobile testing build

/*
backend/test_mobile_backend.sh      //start backend for mobile testing
frontend/test_mobile_frontend.sh    //start frontend for mobile testing
*/

export const environment = {
    production: false,
    versionCheckURL: 'app.korangle.com/version.json',
    DJANGO_SERVER: 'http://' + window.location.hostname + ':8000', //for mobile + normal debugging over LAN
    CASHFREE_CHECKOUT_URL: 'https://test.cashfree.com/billpay/checkout/post/submit',
    api_version: '/v2.0',
};
