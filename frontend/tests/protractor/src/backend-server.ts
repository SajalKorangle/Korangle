
const { exec, execSync } = require('child_process');

// We are assuming that the tests are run from frontend folder.

export function startBackendServer(fixtureFileList: any) {
    const command = '../backend/manage.py testserver --no-input --nomigrations `find ../backend/fixtures/constants/ -path "*.json"` ';
    console.log(command + fixtureFileList);
    stopBackendServer();
    exec(command + fixtureFileList,
        (err, stdout, stderr) => {
            // console.log('Backend server ended');
        });
    return new Promise((resolve) => { setTimeout(() => { resolve(); }, 7500); });
}

export function stopBackendServer() {
    execSync('kill -9 `ps aux | grep testserver | awk \'{ print $2 }\'` > /dev/null 2>&1 &');
}
