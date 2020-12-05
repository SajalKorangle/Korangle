
const glob = require("glob");
const table = require("table");
const fs = require("fs");

// flag -> value/s
// --file -> any file name will be compared with feature file name
// --max-features -> any number
// --min-features -> any number

let argumentsConfig = {
    '--file': null,
    '--max-features': null,
    '--min-features': null,
};

process.argv.slice(2).forEach(argument => {
    const flag = argument.split('=')[0];
    const value = argument.split('=')[1];
    switch(flag) {
        case '--file':
            if (value.length > 0) {
                argumentsConfig["--file"] = value;
                return;
            }
            throw 'Any string will be a valid value for --file';
        case '--max-features':
            if (!isNaN(value)) {
                argumentsConfig["--max-features"] = value;
                return;
            }
            throw 'Any number will be a valid value for --max-features';
        case '--min-features':
            if (!isNaN(value)) {
                argumentsConfig["--min-features"] = value;
                return;
            }
            throw 'Any number will be a valid value for --min-features';
        default:
            throw 'Valid arguments are: --file, --max-features, --min-features\n' +
            'Example: --file=add-student';
    }
});

let featureList = [];
let componentList = [];
glob.sync('src/app/**/*.component.ts').forEach( file => {
    let component = {};
    component.filePathAndName = file.substring(8);
    component.fileName = (file.split('/')[file.split('/').length - 1]).slice(0, -13);
    component.numberOfFeatures = 0;
    let featureFile = '../../tests/features/' + file.substring(8).slice(0, -13) + '.json';
    if (fs.existsSync(featureFile.substring(6))) {
        component.numberOfFeatures = require(featureFile).length;
    }
    if (argumentsConfig["--file"] && argumentsConfig["--file"].localeCompare(component.fileName) !== 0) {
        return;
    }
    if (argumentsConfig["--max-features"] && argumentsConfig["--max-features"] < component.numberOfFeatures) {
        return;
    }
    if (argumentsConfig["--min-features"] && argumentsConfig["--min-features"] > component.numberOfFeatures) {
        return;
    }
    componentList.push(component);
});

let componentListForPrinting = [];
componentListForPrinting.push(['S. No.', 'Component', 'File Path', '# of Features']);
componentList.forEach((component, index) => {

    let rowData = [];
    rowData.push(index+1); // S. No.
    rowData.push(component.fileName); // Statement
    rowData.push(component.filePathAndName); // Feature File Path And Name
    rowData.push(component.numberOfFeatures); // # of Features
    componentListForPrinting.push(rowData);

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
        }
    }
};

console.log(table.table(componentListForPrinting, config));
