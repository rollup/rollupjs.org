---
title: JavaScript API
---

Rollup provides a JavaScript API which is usable from Node.js. You will rarely need to use this, and should probably be using the command line API unless you are extending Rollup itself or using it for something esoteric, such as generating bundles programmatically.

### rollup.rollup

The `rollup.rollup` function returns a Promise that resolves to a `bundle` object with various properties and methods shown here:

```javascript
const rollup = require('rollup');

// see below for details on the options
const inputOptions = {...};
const outputOptions = {...};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.imports); // an array of external dependencies
  console.log(bundle.exports); // an array of names exported by the entry point
  console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
```


#### inputOptions

The `inputOptions` object can contain the following properties (see the [big list of options](#big-list-of-options) for full details on these):

```js
const inputOptions = {
  // core options
  input, // the only required option
  external,
  plugins,

  // advanced options
  onwarn,
  cache,

  // danger zone
  acorn,
  context,
  moduleContext,
  legacy
};
```


#### outputOptions

The `outputOptions` object can contain the following properties (see the [big list of options](#big-list-of-options) for full details on these):

```js
const outputOptions = {
  // core options
  file, // required with bundle.write
  format, // required
  name,
  globals,

  // advanced options
  paths,
  banner,
  footer,
  intro,
  outro,
  sourcemap,
  sourcemapFile,
  interop,

  // danger zone
  exports,
  amd,
  indent
  strict
};
```


### rollup.watch

Rollup also provides a `rollup.watch` function that rebuilds your bundle when it detects that the individual modules have changed on disk. It is used internally when you run Rollup from the command line with the `--watch` flag.

```js
const rollup = require('rollup');

const watchOptions = {...};
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
  // event.code can be one of:
  //   START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //   BUNDLE_END   — finished building a bundle
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //   FATAL        — encountered an unrecoverable error
});

// stop watching
watcher.close();
```

#### watchOptions

The `watchOptions` argument is a config (or an array of configs) that you would export from a config file.

```js
const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {
    chokidar,
    include,
    exclude
  }
};
```

See above for details on `inputOptions` and `outputOptions`, or consult the [big list of options](#big-list-of-options) for info on `chokidar`, `include` and `exclude`.




**• onwarn**  *function*

A function which will intercept warning messages. If not supplied, warnings will just be deduplicated and printed to the console.

Warnings are objects with at minimum a `code` and a `message` property, letting you customize the handling for your needs.

```js
let inputOptions = {
  onwarn: function(warning) {
    // skip certain warnings
    if ( warning.code === 'UNUSED_EXTERNAL_IMPORT' ) {
      return;
    }
    // throw other warnings
    if ( warning.code === 'NON_EXISTENT_EXPORT' ) {
      throw new Error( warning.message );
    }
    // console.warn everything else
    console.warn( warning.message );
  }
}
```

Many warnings also have `loc` and `frame` properties which can help you precisely locate the source of the problem that caused the warning. `loc` is a *location* object containing properties for the *file*, *line* of code and *column* where the error occurred, and `frame` is a string with the surrounding code.

```js
let inputOptions = {
  onwarn: function(warning) {
    // print location if provided
    if (warning.loc) {
      console.warn(warning.loc.file + warning.loc.line + ':' + warning.loc.column);
    }
    // print surrounding code if provided
    if (warning.frame) {
      console.warn(warning.frame);
    }
    // generic logging of
    console.warn(warning.message);
  }
};
```


**• acorn** *object*

Any parameters that should be passed through to [Acorn](https://github.com/ternjs/acorn).


**• context** *object*

In ES6 modules, the `this` object is always `undefined`. In rare cases you might need to change this to something else, like `window`. Use of this option is discouraged.


**• moduleContext** *object* or *function*

When the `moduleContext` property contains an *object*, it should consist of key-value pairs where the key is the module ID and the value is the context object to use for that module.

When the `moduleContext` property contains a *function*, it will be called for every module ID. If the function returns a value, it will be treated as the value to be used as the `this` keyword for that module; otherwise, the value of the `this` context will be `undefined` as usual.

Use of this option is discouraged.


**• legacy** *boolean*

Adds support for very old environments like IE8 by stripping out more modern code that might not work reliably, at the cost of deviating slightly from the precise specifications required of ES6 module environments.


### Output

The Promise returned by the `rollup.rollup()` method resolves to an object representing the compiled bundle.

**• bundle.generate(*outputOptions*)**

Compiles the project. Returns a Promise which resolves an object contains properties for the compiled `code` (as a string) and the `map` (a sourcemap object). The optional configuration object argument is identical to the configuration object you might use in a configuration file for the command line, but any input options will be ignored because the inputs have already been supplied.

**• bundle.write(*outputOptions*)**

Compiles the project *and* writes the file to disk, returning a Promise which resolves when the write operation has completed. This requires a configuration object argument which specifies an output filename under the `dest` property.


### Output options

**• file** *string* (required with `bundle.write`)

The file to create. Will also be used for sourcemaps, if applicable.

**• format** *string* (required)

The format of the bundle — one of:

- `iife`: an *immediately-invoked function expression*, typically used from within a `<script>` tag.
- `cjs`: a [CommonJS module](https://en.wikipedia.org/wiki/CommonJS) like those popularized by Node.js, webpack, and browserify.
- `amd`: an [Asynchronous Module Definition](http://requirejs.org/docs/whyamd.html) as popularized by [RequireJS](http://requirejs.org/).
- `umd`: a [Universal Module Definition](https://github.com/umdjs/umd) which is usable either from within a `<script>` tag, as a CommonJS module, or as an AMD module. Because it's so flexible, this is the *recommended option*, but it requires that you also specify a module name as described below.
- `es`: bundles your multiple ES6 modules into a single ES6 module.

**• name** *string* (required for `iife`/`umd` bundles with exports)

The variable name, representing your bundle, by which other scripts on the same page can access it.

**• globals** *object* or *function*

For `iife`/`umd` bundles that have external dependencies, Rollup needs to know the global variable names corresponding to each dependency.


**• paths** *object* or *function*

Specifies paths of **external files** for use in the bundle. At the end of the build, the bundler will rewrite references to these modules so they use the external locations. For now this is only useful for AMD and UMD output formats and loading dependencies from a CDN, but eventually it will also be used for loading of remote ES6 modules.

When the `paths` property contains an *object*, it should consist of key-value pairs where the key is the module ID and the value is the remote location.

```javascript
let outputOptions = {
  paths: {
    d3: 'https://d3js.org/d3.v4.min.js'
  }
};
```

When the `paths` property contains a *function*, it will be called for every module ID. If the function returns the original input ID, no remote loading is attempted; if it returns anything else, it will be treated as a *string* representing the remote location of the module.

```javascript
let outputOptions = {
  paths: function(id) {
    if (id === 'd3') {
      return 'https://d3js.org/d3.v4.min.js';
    }
    return id;
  }
};
```