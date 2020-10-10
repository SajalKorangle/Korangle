const https = require('https');
const fs = require('fs');
const current = require('../../tmp/coverage-summary.json');
const coverageData = require('../../tmp/karma-coverage-data.json');
let benchmark;

https.get("https://korangleplus.s3.amazonaws.com/benchmark-karma-coverage.json", function(response) {
    let body = "";
    response.on("data", (chunk) => {
        body += chunk;
    });
    response.on("end", () => {

        benchmark = JSON.parse(body);

        let newCoverage = {
            "statements": getNewCoverage('statements'),
            "testToComponentRatio": coverageData.numberOfTests/coverageData.numberOfComponents
        };

        console.log('BenchMark');
        console.log(benchmark);
        console.log('Your Coverage');
        console.log(newCoverage);

        let numberOfRequiredTests = 0;
        Object.keys(newCoverage).forEach((key) => {
            const testDemand = Math.ceil(((benchmark[key] - newCoverage[key])/newCoverage[key])*coverageData.numberOfTests);
            if (testDemand > numberOfRequiredTests) {
                numberOfRequiredTests = testDemand;
            }
        });

        if (numberOfRequiredTests > 0) {
            const message = "Insufficient Coverage!\n" +
                "Roughly " + numberOfRequiredTests + " more karma test/s required.";
            throw message;
        }

        if (process.argv[2] === 'github') {
            fs.writeFileSync("karma-coverage.json", JSON.stringify(newCoverage));
        }

        console.log("Karma coverage passed!!!");

    });
});

function getNewCoverage(param) {
    return current['total'][param]['pct'];
}

