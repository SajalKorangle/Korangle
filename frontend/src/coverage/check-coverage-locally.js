const https = require('https');
const current = require('./coverage-summary.json');
let benchmark;

https.get("https://korangleplus.s3.amazonaws.com/benchmark-coverage.json", function(response) {
    let body = "";
    response.on("data", (chunk) => {
        body += chunk;
    });
    response.on("end", () => {
        try {
            benchmark = JSON.parse(body);

            let newCoverage = {
                "lines": getNewCoverage('lines'),
                "statements": getNewCoverage('statements'),
                "branches": getNewCoverage('branches'),
                "functions": getNewCoverage('functions')
            };

            console.log('BenchMark');
            console.log(benchmark);
            console.log('Your Coverage');
            console.log(newCoverage);

        } catch (error) {
            console.error(error.message);
        };
    });
});

function getNewCoverage(param) {
    return current['total'][param]['pct'];
}

