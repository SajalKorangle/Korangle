// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// TODO: Testing Different browsers through puppeteer

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

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
      // args: ['--headless', '--window-size=800x600'],
      args: ['--headless'],
      // args: [],
      binary: puppeteer.executablePath(),
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:4201/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
