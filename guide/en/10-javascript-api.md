---
title: JavaScript API
---

Rollup provides a JavaScript API which is usable from Node.js. You will rarely need to use this, and should probably be using the command line API unless you are extending Rollup itself or using it for something esoteric, such as generating bundles programmatically.

### Including

Alas, Node doesn't yet natively support ES6 modules so you'll need to import Rollup as a CommonJS module using `require()`, even though that's off message for an ES6 module tool :(

```javascript
let rollup = require('rollup');
```

Rollup exports an object which contains a single `.rollup()` method.

### Input

**rollup.rollup(*inputOptions*)**

The `rollup.rollup()` method specifies the inputs passed to Rollup for compilation. It takes a single argument, which is an object containing one or more of the following properties, and it returns a Promise which resolves to the bundle object.

### Input Options

The following properties can be added to your input options object to change the default behavior of the `rollup.rollup()` method:

**• entry** *string* (required)

The module's entry point file from which to start compilation and resolution of dependencies. This is likely identical to the `module` field in your package.json file.

```javascript
let inputOptions = {
  entry: './app.js'
};
```

**• plugins** *array*

An array of Rollup plugins that should be used to transform the bundle code. The plugins are functions when imported, but the functions *must to be called* in order for the plugin to work.

```javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let inputOptions = {
  plugins: [
    resolve(),
    commonjs()
  ]
};
```

**• cache** *object*

An optional variable representing the last bundle compiled by the current Node process. This is mostly useful for speeding up incremental rebuilds, such as when you're watching the files and rebuilding automatically on changes.

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


**• paths** *object* or *function*

Specifies paths of **external files** for use in the bundle. At the end of the build, the bundler will rewrite references to these modules so they use the external locations. For now this is only useful for AMD and UMD output formats and loading dependencies from a CDN, but eventually it will also be used for loading of remote ES6 modules.

When the `paths` property contains an *object*, it should consist of key-value pairs where the key is the module ID and the value is the remote location.

```javascript
let inputOptions = {
  paths: {
    d3: 'https://d3js.org/d3.v4.min.js'
  }
};
```

When the `paths` property contains a *function*, it will be called for every module ID. If the function returns the original input ID, no remote loading is attempted; if it returns anything else, it will be treated as a *string* representing the remote location of the module.

```javascript
let inputOptions = {
  paths: function(id) {
    if (id === 'd3') {
      return 'https://d3js.org/d3.v4.min.js';
    }
    return id;
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

**• bundle.generate(*config*)**

Compiles the project. Returns an object which contains properties for the compiled `code` (as a string) and the `map` (a sourcemap object). The optional configuration object argument is identical to the configuration object you might use in a configuration file for the command line, but any input options will be ignored because the inputs have already been supplied.

**• bundle.write(*config*)**

Compiles the project *and* writes the file to disk, returning a Promise which resolves when the write operation has completed. This requires a configuration object argument which specifies an output filename under the `dest` property.
