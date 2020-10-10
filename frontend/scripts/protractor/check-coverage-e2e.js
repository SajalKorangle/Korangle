
const https = require('https');
const fs = require('fs');
const coverageData = require('../../tmp/protractor-coverage-data.json');

const newCoverage = {
    'semiColonRatio': coverageData.numberOfSemiColonInTests/coverageData.numberOfSemiColonInApplication,
    'testToComponentRatio': coverageData.numberOfTests/coverageData.numberOfComponents,
};

https.get("https://korangleplus.s3.amazonaws.com/benchmark-protractor-coverage.json", function(response) {
    let body = "";
    response.on("data", (chunk) => {
        body += chunk;
    });
    response.on("end", () => {

        const benchmark = JSON.parse(body);

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
                "Roughly " + numberOfRequiredTests + " more protractor test/s required.";
            throw message;
        }

        if (process.argv[2] === 'github') {
            fs.writeFileSync('protractor-coverage.json', JSON.stringify(newCoverage));
        }

        console.log("Protractor coverage passed!!!");

    });
});

