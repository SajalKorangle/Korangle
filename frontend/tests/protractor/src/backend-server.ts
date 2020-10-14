
const { exec, execSync } = require('child_process');

// We are assuming that the tests are run from frontend folder.

export function startBackendServer(fixtureFileList: any) {
    // console.log(fixtureFileList);
    // execSync('kill -9 `ps aux | grep testserver | awk \'{ print $2 }\'` 2> /dev/null &0>tmp/garbageCollector &1>tmp/garbageCollector');
    execSync('kill -9 `ps aux | grep testserver | awk \'{ print $2 }\'` 2 > /dev/null &');
    /*execSync('../backend/manage.py testserver --nomigrations `find ../backend/fixtures/constants/ -path "*.json"` '
        + fixtureFileList + ' &');*/
    exec('../backend/manage.py testserver --nomigrations `find ../backend/fixtures/constants/ -path "*.json"` ' + fixtureFileList,
        (err, stdout, stderr) => {
        // console.log('Backend server ended');
    });
}

export function stopBackendServer() {
    execSync('kill -9 `ps aux | grep testserver | awk \'{ print $2 }\'` 2> /dev/null &0>tmp/garbageCollector &1>tmp/garbageCollector');
}
