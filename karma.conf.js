module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('karma-jasmine-html-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      reporters: ['progress', 'coverage'],
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/stay-nest'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'lcovonly' }, // <-- este es necesario para Sonar
          { type: 'text-summary' }
        ]
      },
      browsers: ['ChromeHeadless'],
      restartOnFileChange: true
    });
  };
  