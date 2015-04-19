module.exports = function(config) {
  "use strict";
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/lodash/dist/lodash.min.js',
      'src/partials/*.html',
      'src/*.js',
      'test/**/*.js',
    ],

    preprocessors : {
      // generate js files from html templates
      '../**/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates'
    },

    reporters: ['progress', 'growl'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
