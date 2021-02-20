// This file will be override by environment.prod.ts during production build

/*
var { exec } = require("child_process");

exec("hostname -I | awk '{print $1}'", (error, stdout, stderr) => {
    var IP = `http://:${stdout}:8000`;
    console.log(IP);
});
*/

export const environment = {
    production: false,
    versionCheckURL: 'www.korangle.com/version.json',
    //DJANGO_SERVER: 'http://localhost:8000', // normal debugging only (localhost)
    DJANGO_SERVER: 'http://192.168.29.79:8000', //for mobile + normal debugging (LAN)
    api_version: '/v2.0',
};
