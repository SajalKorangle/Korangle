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

            console.log(newCoverage);

            Object.keys(newCoverage).forEach((key) => {
                if (newCoverage[key] == -1) {
                    console.log(current);
                    cosole.log(benchmark);
                    throw error;
                }
            });

        } catch (error) {
            console.error(error.message);
        };
    });
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

