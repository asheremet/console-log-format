'use strict';

const log = console.log;

const config = {};
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
const defaults = {
  style: {
    path: {
      text: 'cyan',
      effect: 'dim',
      background: 'black',
    },
    arguments: {
      text: 'white',
      effect: 'bright',
      background: 'black',
    }
  },
  exclude: /node_modules/
};

applyOptionsTo(config, defaults)
// const config = {
//   pathColor: [colors.effect.dim, colors.text.cyan, colors.background.black],
//
// }

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

function getColor(style = {}, type, location) {
  const color = (style[location] && style[location][type]) || defaults.style[location][type]
  return colors[type][color];
}

function getPathColors(style) {
  return [
    getColor(style, 'effect', 'path'),
    getColor(style, 'text', 'path'),
    getColor(style, 'background', 'path'),
  ];
}

function getArgColors(style) {
  const args = style && style.arguments;
  return (Array.isArray(args) ? args : [args]).map(argStyle => {
    return [
      getColor({ arguments: argStyle }, 'effect', 'arguments'),
      getColor({ arguments: argStyle }, 'text', 'arguments'),
      getColor({ arguments: argStyle }, 'background', 'arguments'),
    ]
  })
}

function applyOptionsTo(conf, options) {
  Object.assign(conf, options);
  conf.pathColor = getPathColors(options.style);
  conf.argumentsColors = getArgColors(options.style);
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
    args = [].concat(...args.map((arg, i) => [`${(conf.argumentsColors[i] || []).join('')}${arg}${colors.effect.reset}`]));
    fn(`${conf.pathColor.join('')}${path}${colors.effect.reset}`, ...args);
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
