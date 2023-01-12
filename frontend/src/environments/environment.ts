// This file will be override by environment.prod.ts during production build

export const environment = {
    production: false,
    versionCheckURL: 'app.korangle.com/version.json',
    DJANGO_SERVER: 'http://localhost:8000', // normal debugging only (localhost)
    CASHFREE_CHECKOUT_URL: 'https://test.cashfree.com/billpay/checkout/post/submit',
    api_version: '/v2.0',
    MEDIA_URL: "https://korangletesting.s3.amazonaws.com/",
};
