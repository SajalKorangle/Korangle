
const glob = require("glob");

const files = glob.sync('tests/features/**/*.json');

let filterFeatureFunc;
switch (process.argv[2]) {
    case 'karma':
        filterFeatureFunc = feature => feature.testType === 'karma';
        break;
    case 'karma-available':
        filterFeatureFunc = feature => feature.testName === null && feature.testType === 'karma';
        break;
    case 'karma-done':
        filterFeatureFunc = feature => feature.testName !== null && feature.testType === 'karma';
        break;
    case 'protractor':
        filterFeatureFunc = feature => feature.testType === 'protractor';
        break;
    case 'protractor-available':
        filterFeatureFunc = feature => feature.testName === null && feature.testType === 'protractor';
        break;
    case 'protractor-done':
        filterFeatureFunc = feature => feature.testName !== null && feature.testType === 'protractor';
        break;
    case 'available':
        filterFeatureFunc = feature => feature.testName === null;
        break;
    case 'done':
        filterFeatureFunc = feature => feature.testName !== null;
        break;
    default:
        filterFeatureFunc = feature => true;
}


let counter = 0;
files.forEach( file => {
    require('../../' + file).filter(feature => filterFeatureFunc(feature)).forEach(feature => {
        counter++;
        console.log(counter + ') ' + feature.statement + ' (' + file.substring(15) + ')');
    });
});

console.log('Total Features: ' + counter);
