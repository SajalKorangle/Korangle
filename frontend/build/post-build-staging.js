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
const versionFilePath = path.join(__dirname + '/../korangle/version.json');

// read the korangle folder files and find the one we're looking for
const src = {
	"computerLastUpdation": updationTime.toString(),
	"mobileLastUpdation": updationTime.toString(),
};
writeFile(versionFilePath, JSON.stringify(src));
