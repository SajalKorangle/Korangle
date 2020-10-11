// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// TODO: Testing Different browsers through puppeteer

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');
var retry = require('protractor-retry').retry;

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
    defaultTimeoutInterval: 50000,
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
