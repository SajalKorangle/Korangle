const fs = require('fs');

const lint_data_loc = './tmp/benchmark-linting-error-count.json';


// download -> ./tmp/linting_error_count.json
// ...


// load json
var lint_data = JSON.parse(fs.readFileSync(lint_data_loc,
                    {encoding: 'utf8', flag: 'r+'}));


if (process.argv[2] === 'set') {
    lint_data['tslint-errors'] = process.argv[3];   // update

    console.log('Benchmark updated: ' + lint_data['tslint-errors'] + ' errors remaining.');

    // write json
    fs.writeFileSync(lint_data_loc, JSON.stringify(lint_data, null, 4))

    // upload the output to aws here or from the shell script
}

if (process.argv[2] === 'count') {
    if (process.argv[3] > lint_data['tslint-errors']) {
        console.log('\n\nERROR: Please fix ' + (process.argv[3] - lint_data['tslint-errors']) + ' linting errors.');
        process.exit(1);
    }
    if (process.argv[3] <= lint_data['tslint-errors']) {
        console.log('\n\nLinting check passed.');
        process.exit(0);
    }
}
