const fs = require('fs');
const current = require('./coverage-summary.json');
const benchmark = require('./benchmark-coverage.json');

/*console.log(current['total']['lines']['pct']);
console.log(current['total']['statements']['pct']);
console.log(current['total']['branches']['pct']);
console.log(current['total']['functions']['pct']);*/

let newCoverage = {
    "lines": getNewCoverage('lines'),
    "statements": getNewCoverage('statements'),
    "branches": getNewCoverage('branches'),
    "functions": getNewCoverage('functions')
};

console.log(newCoverage);

// Checking Coverage
Object.keys(newCoverage).forEach((key) => {
    if (newCoverage[key] == -1) {
        console.log(key);
        throw error;
    }
});

fs.writeFile("src/coverage/new-coverage.json", JSON.stringify(newCoverage), err => {

    // Checking for errors
    if (err) throw err;

    console.log("Done writing"); // Success
});

function getNewCoverage(param) {
    if (benchmark[param]-current['total'][param]['pct'] > 0.01) {
        return -1;
    } else if (benchmark[param]-current['total'][param]['pct'] >= 0) {
        return benchmark[param];
    } else if (benchmark[param]-current['total'][param]['pct'] < 0) {
        return current['total'][param]['pct'];
    }
}
