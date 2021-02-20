// environment.ts file will be overridden by this file during mobile testing build

/*
backend/test_mobile_backend.sh      //start backend for mobile testing
frontend/test_mobile_frontend.sh    //start frontend for mobile testing
*/


/*
// npx ts-node environment.mobile.ts

const { exec } = require("child_process");

var IP = exec('hostname -I | awk \'{print $1}\'');

IP = `http://:${IP}:8000`;

console.log(IP);
*/

export const environment = {
    production: false,
    versionCheckURL: 'www.korangle.com/version.json',
    //DJANGO_SERVER: 'http://localhost:8000',   // normal debugging only (localhost)
    DJANGO_SERVER: 'http://192.168.29.79:8000', //for mobile + normal debugging (LAN) (Your local IP goes here: <http://IP:8000>)
    api_version: '/v2.0',
};
