
const glob = require("glob");
const https = require('https');
const fs = require('fs');
const coverageData = require('../../tmp/feature-coverage-data.json');


let featureList = [];
glob.sync('tests/features/**/*.json').forEach( file => {
    featureList = featureList.concat(require('../../' + file));
});

if (featureList.filter(feature => feature.testName !== null && feature.testType === 'protractor').length !== coverageData.numberOfProtractorTests) {
    throw "Protractor: Number of implemented features are not equal to number of tests implemented";
}

if (featureList.filter(feature => feature.testName !== null && feature.testType === 'karma').length !== coverageData.numberOfKarmaTests) {
    throw "Karma: Number of implemented features are not equal to number of tests implemented";
}

const newCoverage = {
    'protractor': featureList.filter(feature => feature.testType === 'protractor').length/coverageData.numberOfComponents,
    'karma': featureList.filter(feature => feature.testType === 'karma').length/coverageData.numberOfComponents
};

https.get("https://korangleplus.s3.amazonaws.com/benchmark-feature-coverage.json", function(response) {
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

        Object.keys(newCoverage).forEach((key) => {
            if (benchmark[key] - newCoverage[key] > 0.0) {
                let message = "Insufficient Features!\nPlease add more features";
                throw message;
            }
        });

        let numberOfFeaturesRequired = 0;
        Object.keys(newCoverage).forEach((key) => {
            if ( ! key in benchmark ) {
                benchmark[key] = 0;
            }
            const featureDemand =
                Math.ceil(
                    ((benchmark[key] - newCoverage[key])/newCoverage[key])
                    *featureList.filter(feature => feature.testType === key).length
                );
            if (featureDemand > 0) {
                console.log("Insufficient Features!\n" +
                    "Roughly " + featureDemand + " more " + key + " feature/s should be added.");
            }
            numberOfFeaturesRequired += featureDemand;
        });

        if (numberOfFeaturesRequired > 0) {
            throw '';
        }

        if (process.argv[2] === 'github') {
            fs.writeFileSync('feature-coverage.json', JSON.stringify(newCoverage));
        }

        console.log("Feature Coverage passed!!!");

    });
});

