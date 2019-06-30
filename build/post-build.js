const path = require('path');
const fs = require('fs');
const util = require('util');

// get application version from package.json
const appVersion = require('../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

console.log('\nRunning post-build tasks');

var myArgs = process.argv.slice(2)

var updationTime = Math.floor((new Date).getTime()/1000);

// our version.json will be in the korangle folder
const versionFilePath = path.join(__dirname + '/../version.json');

// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main.?([a-z0-9]*)?.js$/;

// read the korangle folder files and find the one we're looking for
readDir(path.join(__dirname, '../korangle/'))
  .then(files => {

    mainBundleFile = files.find(f => mainBundleRegexp.test(f));

    console.log(`Writing version and hash to ${versionFilePath}`);

    // write current version and hash into the version.json file
    // const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;

    return readFile(versionFilePath, 'utf8').then(versionFileData => {
      console.log(JSON.parse(versionFileData).computerLastUpdation);
      const src = {
        "computerLastUpdation": updationTime.toString(),
      };
      if (myArgs[0] && myArgs[0] == "mobile") {
        src["mobileLastUpdation"] = updationTime.toString();
      } else {
        src["mobileLastUpdation"] = JSON.parse(versionFileData).mobileLastUpdation
      }
      console.log(src);
      return writeFile(versionFilePath, JSON.stringify(src));
    });
  }).then(() => {
    // main bundle file not found, dev build?
    if (!mainBundleFile) {
      return;
    }

    console.log(`Replacing lastUpdated in the ${mainBundleFile}`);

    // replace hash placeholder in our main.js file so the code knows it's current hash
    const mainFilepath = path.join(__dirname, '../korangle/', mainBundleFile);
    return readFile(mainFilepath, 'utf8')
      .then(mainFileData => {
        const replacedFile = mainFileData.replace('{{POST_BUILD_ENTERS_LAST_UPDATED_HERE}}', updationTime.toString());
        return writeFile(mainFilepath, replacedFile);
      });
  }).catch(err => {
    console.log('Error with post build:', err);
  });
