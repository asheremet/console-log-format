'use strict';

function filePath() {
  const fileName = __filename.replace(/\//g, '\\/');
  const trace = new Error().stack.replace(new RegExp(`[\\s\\S]+${fileName}.*?\\)\\s+`, 'm'), '');
  return trace.split('\n')[0].replace(/\s*at.+\((.*)\)?/, '$1');
}

function printLine(fn, ...args) {
  const path = filePath();
  const excludeRE = /node_modules/;
  if (excludeRE.test(path)) {
    fn(...args);
  } else {
    fn('\x1b[2m', '\x1b[36m', path, '\x1b[0m', ...args);
  }
}

function logTimeDiff(d, ...rest) {
  console.log(`${new Date() - d} ms`, ...rest);
}

console.log = printLine.bind(null, console.log);
console.trace = printLine.bind(null, console.trace);
console.timeStamp = console.log.bind(null, new Date());
console.timeDiff = logTimeDiff;

module.exports = {};
