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
  pathColor: [colors.effect.dim, colors.text.cyan, colors.background.black],
  exclude: /node_modules/
}

function filePath() {
  const fileName = __filename.replace(/\//g, '\\/');
  const root = process.cwd().replace(/\//g, '\\/')
  const trace = new Error().stack.replace(new RegExp(`[\\s\\S]+${fileName}.*?\\)\\s+`, 'm'), '');
  return trace.split('\n')[0].replace(new RegExp(`\\s*at.+${root}(.*):.*$`), '<root>$1');
}

function isOptions(arg) {
  if (typeof arg === 'object' && !Array.isArray(arg)){
    return ['style', 'exclude'].some(key => !!arg[key]);
  }
  return false;
}

function applyOptionsTo(conf, options) {
  Object.assign(conf, options);
  const style = options.style;
  if(style){
    const [effect, text, background] = config.pathColor;
    conf.pathColor = [
      colors.effect[style.effect] || effect,
      colors.text[style.text] || text,
      colors.background[style.background] || background
     ];
  }
}

function printLine(fn, ...args) {
  const path = filePath();
  const conf = { ...config };
  const lastArg = args[args.length - 1];
  if (isOptions(lastArg)) {
    const options = args.pop();
    applyOptionsTo(conf, options);
  }
  if (conf.exclude && conf.exclude.test(path)) {
    fn(...args);
  } else {
    fn(...conf.pathColor, path, colors.effect.reset, ...args);
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
  applyOptionsTo(config, options);
};
