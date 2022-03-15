# Console.log Formatter
Make your `console.log` more visible and stand out from others'. See the file path and the line number where the `console.log` is placed to make cleaning up easier.\
*Note*: only works on Mac for now

## Installation
```
npm install -g console-log-formatter
```

## Usage

Import the package in the lower-level code, and its features will be available throughout the code base.\
You can provide configuration options to the constructor to override default settings for all usages or to individual calls in the last argument. Options passed as an argument take precedence over constructor.

```js
require('console-log-formatter')({
  style: { path: { text: 'red'} }
});
```
```js
import formatter from 'console-log-formatter';
formatter({
  style: {path: { text: 'red'} }
});
```
```js
console.log("Hello", "world", {
  clf: true, 
  style: { arguments: { text: 'yellow'} }
})
```

## Options
* `clf` (Boolean)
    * required to be set to `true` only when options are passed as the last argument to a function. It tells the formatter that this argument is a configuration object
* `disable` (Boolean)
    * use when you need to disable formatting on certain functions
* `exclude` (RegEx)
    * by default, anything in `node_modules` is not formatted. Pass your own RegEx to define paths to the files to be excluded from formatting. To apply formatting to everything, set to `null`.
* `path` (Boolean)
    * by default, the path to the file with the line number of where the function is called from is logged in front of all other arguments. To exclude, set to `false`.
* `style` (Object)
    * the styling object to describe the colors of the text and background of file paths and function arguments
    * the following colors are available to choose from: \
`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`\
Also available the following effects:\
`bright`, `dim`, `underline`, `blink`, `reverse`, `hidden`
    * `path` (Object)
        * options defining format of the file path
        * `text`
        * `background`
        * `effect`
    * `arguments` (Object or Array of object)
        * options defining format of function arguments. You can pass a single object to define formatting for all arguments, or an array of objects to define formatting for individual argument. To skip a single argument in the array and have it take the default format, pass `undefined` in its place. 
        * `text`
        * `background`
        * `effect`

## Functions

#### `log`
your good old `console.log`
#### `trace`
and `console.trace`
#### `timeStamp`
`console.log` with time stamp added to the front
#### `timeDiff(Date, [...other args])`
logs the time difference in `ms` from the time passed as argument until `now`
```js
const date = new Date();
setTimeout(() => {
	console.timeDiff(date, 'time', 'diff')
}, 150);
```


