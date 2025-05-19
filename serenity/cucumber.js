module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require features/**/*.ts',
    '--format progress',
    '--format html:reports/report.html',
    '--format json:reports/report.json',
    'features/**/*.feature'
  ].join(' ')
};
