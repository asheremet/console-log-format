'use strict';

const colors = {
  effect: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
  },
  text: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },
  background: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  }
};
const config = {
  pathColor: [colors.effect.dim, colors.text.cyan],
  exclude: /node_modules/
}

function filePath() {
  const fileName = __filename.replace(/\//g, '\\/');
  const root = process.cwd().replace(/\//g, '\\/')
  const trace = new Error().stack.replace(new RegExp(`[\\s\\S]+${fileName}.*?\\)\\s+`, 'm'), '');
  return trace.split('\n')[0].replace(new RegExp(`\\s*at.+${root}(.*):.*$`), '<root>$1');
}

function printLine(fn, ...args) {
  const path = filePath();
  if (config.exclude.test(path)) {
    fn(...args);
  } else {
    fn(...config.pathColor, path, colors.effect.reset, ...args);
  }
}

function logTimeDiff(d, ...rest) {
  console.log(`${new Date() - d} ms`, ...rest);
}

console.log = printLine.bind(null, console.log);
console.trace = printLine.bind(null, console.trace);
console.timeStamp = console.log.bind(null, new Date());
console.timeDiff = logTimeDiff;

module.exports = function formatter (options = {}) {
  Object.assign(config, options);
  const style = options.style;
  if(style){
    config.pathColor = config.pathColor
      .concat(colors.effect[style.effect], colors.text[style.text], colors.background[style.background])
      .filter(el => !!el)
  }
};
