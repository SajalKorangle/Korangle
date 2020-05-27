// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {

      dir: require('path').join(__dirname, './coverage/'),
      reports: ['json-summary'],

      // For Manual checking of report
      // dir: require('path').join(__dirname, './coverage-report/'),
      // reports: ['html', 'lcovonly', 'text-summary'],

      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches covered from the report
      // skipFilesWithNoCoverage: false,

      /*thresholds: {
        global: {
          statements: 1,
          lines: 1,
          branches: 1,
          functions: 1
        },
      }*/
     },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};
