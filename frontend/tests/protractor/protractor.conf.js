// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// TODO: Testing Different browsers through puppeteer

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');
var retry = require('protractor-retry').retry;
const { exec } = require('child_process');

const command1 = puppeteer.executablePath() +  ' --version'
const command2 = 'node ./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome='

exec(command1,
    (err, stdout, stderr) => {
        console.log(command2 + stdout.split(' ')[1]);
        exec(command2 + stdout.split(' ')[1],
            (err, stdout, stderr) => {
                console.log('Driver Updated')
            });
    });
/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 110000,
  specs: [
    // './src/**/*.e2e-spec.ts'
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
      browserName: 'chrome',
      chromeOptions: {
          args: ['--headless'],
          binary: puppeteer.executablePath(),
      },
      shardTestFiles: true,
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    print: function() {}
  },
  onCleanUp: function(results) {
    retry.onCleanUp(results);
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.protractor.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    retry.onPrepare();
  },
  afterLaunch: function() {
    return retry.afterLaunch(2);
  }
};
