const fs = require('fs');
const https = require('https');


const lint_data_cloud = 'http://0.0.0.0:8000/benchmark-linting-error-count.json'
const lint_data_local = './benchmark-linting-error-count.json';


// download json
https.get(lint_data_cloud, function(response) {
    var body = "";  // store json

    response.on("data", (chunk) => {
        body += chunk;
    });

    // after get
    response.on("end", () => {
        body = JSON.parse(body);   // parse json

        // CI env
        if (process.argv[2] === 'ci') {
            if (process.argv[3] > body['tslint-errors']) {
                console.log('\n\nERROR: Please fix atleast ' + (process.argv[3] - body['tslint-errors']));
                process.exit(1);    // failed
            }
            if (process.argv[3] <= body['tslint-errors']) {
                body['tslint-errors'] = process.argv[3];   // update
                console.log('\n\nLinting check passed.\n');    // passed
            }
        
            // write json to local
            fs.writeFileSync(lint_data_local, JSON.stringify(body, null, 4));   //indent: 4
            console.log('\n\nBenchmark updated: ' + body['tslint-errors'] + ' errors remaining.');
        }
        
        // local dev env
        if (process.argv[2] === 'dev') {
            if (process.argv[3] > body['tslint-errors']) {
                console.log('\n\nERROR: Please fix atleast ' + (process.argv[3] - body['tslint-errors']));
                process.exit(1);
            }
            if (process.argv[3] <= body['tslint-errors']) {
                console.log('\n\nLinting check passed.');
                process.exit(0);
            }
        }        
    });
});




// benchmark-linting_error_count.json:
/*
{
    "tslint-errors": "9233"
}
*/
