'use strict';

const log = console.log;
const config = {};
const colors = {
  effect: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underline: "\x1b[4m",
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
      background: '',
    },
    arguments: {
      text: '',
      effect: '',
      background: '',
    }
  },
  exclude: /node_modules/,
  verboseError: false,
  wrappers: 0,
};

function filePath() {
  const fileName = __filename.replace(/([/\\])/g, '\\$1');
  const root = process.cwd().replace(/([/\\])/g, '\\$1');
  const trace = new Error().stack.replace(new RegExp(`[\\s\\S]+${fileName}.*?\\)\\s+`, 'm'), '');
  return trace.split('\n')[config.wrappers].replace(new RegExp(`\\s*at.+${root}(.*):.*$`), '<root>$1');
}

function isOptions(arg) {
  if (arg && typeof arg === 'object' && !Array.isArray(arg)){
    return arg.clf;
  }
  return false;
}

function getColor(type, location, style = {}) {
  const color = (style[location] && style[location][type])
    || (config.style[location] && config.style[location][type])
    || defaults.style[location][type];
  return colors[type][color];
}

function getPathColors(style) {
  return [
    getColor('effect', 'path', style),
    getColor('text', 'path', style),
    getColor('background', 'path', style),
  ];
}

function getArgColors(argStyle) {
  return [
    getColor('effect', 'arguments', {arguments: argStyle}),
    getColor('text', 'arguments', {arguments: argStyle}),
    getColor('background', 'arguments', {arguments: argStyle}),
  ]
}

function applyStyle(confStyle, optionStyle) {
  const { path = config.path, arguments: args = config.arguments } = optionStyle;
  return { path, arguments: args };
}

function applyOptionsTo(conf, options) {
  conf.verboseError = options.verbose || defaults.verboseError;
  conf.exclude = (options.exclude instanceof RegExp || options.exclude === null) ? options.exclude : defaults.exclude;
  conf.style = options.style && applyStyle(conf.style, options.style) || {};
  conf.disable = options.disable;
  conf.path = options.path;
  conf.wrappers = options.wrappers || 0;
}

function formatArguments(args, argStyles){
  return args.map((arg, i) => {
    if (typeof arg === 'object') return arg;

    let style;
    if (Array.isArray(argStyles)) {
      if (argStyles[i] === null) {
        style = Array.isArray(config.style.arguments) ? config.style.arguments[i] : config.style.arguments;
      } else {
        style = argStyles[i];
      }
    } else {
      style = argStyles;
    }

    return `${getArgColors(style).join('')}${arg}${colors.effect.reset}`;
  });
}

function printLine(fn, ...args) {
  const conf = {...config};
  try {
    const path = filePath();
    let options;
    const lastArg = args[args.length - 1];
    if (isOptions(lastArg)) {
      options = args.pop();
      applyOptionsTo(conf, options);
    }
    if (conf.disable || conf.exclude && conf.exclude.test(path)) {
      fn(...args);
    }
    else {
      args = formatArguments(args, conf.style.arguments);

      if (conf.path === false) {
        fn(...args);
      }
      else {
        const formattedPath = `${getPathColors((options || conf).style).join('')}${path}${colors.effect.reset}`;
        fn(formattedPath, ...args);
      }
    }
  } catch (err) {
    if (conf.verboseError) {
      log(`${colors.text.yellow}!!!!!!!!!!!Error in the Formatter:!!!!!!!!!!!\n`, err);
      log(`=============================================${colors.effect.reset}`);
    } else {
      log(`${colors.text.yellow}Error in Console-Log-Formatter:`, err.message, colors.effect.reset);
    }
  }
}

function logTimeDiff(d, ...rest) {
  console.log(`${new Date() - d} ms`, ...rest);
}

applyOptionsTo(config, defaults)

console.log = printLine.bind(null, console.log);
console.trace = printLine.bind(null, console.trace);
console.timeStamp = console.log.bind(null, new Date());
console.timeDiff = logTimeDiff;

module.exports = function formatter (options = {}) {
  applyOptionsTo(config, options);
};
