
const glob = require("glob");
const table = require("table");

// flag -> value/s
// --framework -> 'protractor', 'karma'
// --status -> 'done', 'available'
// --file -> any file name will be compared with feature file name
// --max-steps -> any number
// --min-steps -> any number

let argumentsConfig = {
    '--framework': null,
    '--status': null,
    '--file': null,
    '--max-steps': null,
    '--min-steps': null,
};

process.argv.slice(2).forEach(argument => {
    const flag = argument.split('=')[0];
    const value = argument.split('=')[1];
    switch(flag) {
        case '--framework':
            switch(value) {
                case 'protractor':
                    argumentsConfig["--framework"] = 'protractor';
                    return;
                case 'karma':
                    argumentsConfig["--framework"] = 'karma';
                    return;
            }
            throw 'Valid values for --framework is protractor, karma';
        case '--status':
            switch(value) {
                case 'done':
                    argumentsConfig["--status"] = 'done';
                    return;
                case 'available':
                    argumentsConfig["--status"] = 'available';
                    return;
            }
            throw 'Valid values for --status is available, done';
        case '--file':
            if (value.length > 0) {
                argumentsConfig["--file"] = value;
                return;
            }
            throw 'Any string will be a valid value for --file';
        case '--max-steps':
            if (!isNaN(value)) {
                argumentsConfig["--max-steps"] = value;
                return;
            }
            throw 'Any number will be a valid value for --max-steps';
        case '--min-steps':
            if (!isNaN(value)) {
                argumentsConfig["--min-steps"] = value;
                return;
            }
            throw 'Any number will be a valid value for --min-steps';
        default:
            throw 'Valid arguments are: --framework, --status, --file, --max-steps, --min-steps\n' +
            'Example: --framework=protractor';
    }
});

let featureList = [];
glob.sync('tests/features/**/*.json').forEach( file => {
    require('../../' + file).forEach(feature => {
        feature.filePathAndName = file.substring(15);
        feature.printSteps = feature.steps.map(step => "- " + step).join('\n');
        feature.fileName = (file.split('/')[file.split('/').length - 1]).slice(0, -5);
        if (argumentsConfig["--framework"] && argumentsConfig["--framework"] !== feature.testType) {
            return;
        }
        if (argumentsConfig["--status"]) {
            if (argumentsConfig["--status"] === 'available' && feature.testName !== null) {
                return;
            }
            if (argumentsConfig["--status"] === 'done' && feature.testName === null) {
                return;
            }
        }
        if (argumentsConfig["--file"] && argumentsConfig["--file"].localeCompare(feature.fileName) !== 0) {
            return;
        }
        if (argumentsConfig["--max-steps"] && argumentsConfig["--max-steps"] < feature.steps.length) {
            return;
        }
        if (argumentsConfig["--min-steps"] && argumentsConfig["--min-steps"] > feature.steps.length) {
            return;
        }
        featureList.push(feature);
    });
});

let featureListForPrinting = [];
featureListForPrinting.push(['S. No.', 'Statement', 'Steps', 'Framework', 'File', 'Status']);
featureList.forEach((feature, index) => {

    let rowData = [];
    rowData.push(index+1); // S. No.
    rowData.push(feature.statement); // Statement
    rowData.push(feature.steps.map(step => "- " + step).join('\n')); // Steps
    rowData.push(feature.testType); // Feature Type
    rowData.push(feature.filePathAndName); // Feature File Path And Name
    rowData.push(feature.testName === null ? 'available': 'done'); // Test Name
    featureListForPrinting.push(rowData);

});

const config = {
    border: table.getBorderCharacters("ramac"),
    columns: {
        0: {
            width: 5
        },
        1: {
            width: 20
        },
        2: {
            width: 35
        },
        3: {
            width: 10
        },
        4: {
            width: 25
        },
        5: {
            width: 25
        }
    }
};

console.log(table.table(featureListForPrinting, config));
