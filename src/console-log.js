'use strict';

const log = console.log;

function filePath() {
  const fileName = __filename.replace(/\//g, '\\/');
  const trace = new Error().stack.replace(new RegExp(`[\\s\\S]+${fileName}.*?\\)\\s+`, 'm'), '');
  return trace.split('\n')[0].replace(/\s*at.+\/iFit(.*)\)?/, '$1');
}

function consoleLog() {
  const path = filePath();
  const excludeRE = /node_modules/;
  if (excludeRE.test(path)) {
    log(...arguments);
  } else {
    log('\x1b[2m', '\x1b[36m', filePath(), '\x1b[0m', ...arguments);
  }
}

function logTimeDiff(d, ...rest) {
  consoleLog(`${new Date() - d} ms`, ...rest);
}

console.log = consoleLog;
console.logTimeDiff = logTimeDiff;
