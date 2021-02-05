// TESTING boilerplate

var data = require('./linting_error_count.json');

var linting_error_count = data['tslint-errors'];


if (process.argv[2] === 'set') {
    console.log('SET: ' + process.argv[3]);
} else {
    console.log('CHECK: ' + linting_error_count);
}