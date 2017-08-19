---
title: Big list of options
---

## Core functionality

**• input** (required)

`String` The bundle's entry point (e.g. your `main.js` or `app.js` or `index.js`)

**• output**

`String` The file to write to.

**• format** (required)

`String` The format of the generated bundle. One of the following:

* `amd` – Asynchronous Module Definition, used with module loaders like RequireJS
* `cjs` – CommonJS, suitable for Node and Browserify/Webpack
* `es` – Keep the bundle as an ES module file
* `iife` – A self-executing function, suitable for inclusion as a `<script>` tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
* `umd` – Universal Module Definition, works as `amd`, `cjs` and `iife` all in one

**• plugins**

`Array` of plugin objects (or a single plugin object) – see [Getting started with plugins](#getting-started-with-plugins) for more information.

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'main.js',
  plugins: [
    resolve(),
    commonjs()
  ]
};
```

**• sourcemap**

If `true`, a separate sourcemap file will be created. If `inline`, the sourcemap will be appended to the resulting `output` file as a data URI.

**• sourcemapFile**

`String` The location of the generated bundle. If this is an absolute path, all the `sources` paths in the sourcemap will be relative to it. The `map.file` property is the basename of `sourcemapFile`, as the location of the sourcemap is assumed to be adjacent to the bundle.

`sourcemapFile` is not required if `output` is specified, in which case an output filename will be inferred by adding ".map"  to the output filename for the bundle.

# Advanced functionality

**• external**

Either...

`Function` that takes an `id` and returns `true` (external) or `false` (not external), or...

`Array` of strings. A list of IDs of modules that should remain external to the bundle. The IDs should be either:

1. the name of an external dependency
1. a resolved ID (like an absolute path to a file)

```js
// rollup.config.js
import path from 'path';

export default {
  ...,
  external: [
    'some-externally-required-library',
    path.resolve( './src/some-local-file-that-should-not-be-bundled.js' )
  ]
};
```

**• paths**

`Function` that takes an ID and returns a path, or `Object` of `id: path` pairs. Where supplied, these paths will be used in the generated bundle instead of the module ID, allowing you to (for example) load dependencies from a CDN:

```js
// app.js
import { selectAll } from 'd3';
selectAll('p').style('color', 'purple');
// ...

// rollup.config.js
export default {
  src: 'app.js',
  dest: 'bundle.js',
  format: 'amd',
  external: ['d3'],
  paths: {
    d3: 'https://d3js.org/d3.v4.min'
  }
};

// bundle.js
define(['https://d3js.org/d3.v4.min'], function (d3) {

  d3.selectAll('p').style('color', 'purple');
  // ...

});
```

**• banner/footer** (configuration file only)

`String` A string to prepend/append to the bundle. (Note: `banner` and `footer` options will not break sourcemaps)

```js
// rollup.config.js
export default {
  ...,
  banner: '/* my-library version ' + version + ' */',
  footer: '/* follow me on Twitter! @rich_harris */'
};
```

**• intro/outro** (configuration file only)

`String` Similar to `banner` and `footer`, except that the code goes *inside* any format-specific wrapper

```js
export default {
  ...,
  intro: 'var ENVIRONMENT = "production";'
};
```

**• cache**

`Object` A previously-generated bundle. Use it to speed up subsequent builds


**• onwarn** (configuration file only)

`Function` that will intercept warning messages. If not supplied, warnings will be deduplicated and printed to the console.

Warnings are objects with at minimum a `code` and a `message` property, meaning you can control how different kinds of warnings are handled:

```js
onwarn (warning) {
  // skip certain warnings
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

  // throw on others
  if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

  // console.warn everything else
  console.warn(warning.message);
}
```

Many warnings also have a `loc` property and a `frame` allowing you to locate the source of the warning:

```js
onwarn ({ loc, frame, message }) {
  // print location if applicable
  if (loc) {
    console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
    if (frame) console.warn(frame);
  } else {
    console.warn(message);
  }
}
```

**• moduleName**

`String` The name to use for the module for `umd`/`iife` bundles (**required** for bundles with exports):

```js
// rollup.config.js
export default {
  ...,
  format: 'iife',
  moduleName: 'MyBundle'
};

// -> var MyBundle = (function () {...
```

**• globals**

`Object` of `id: name` pairs, used for `umd`/`iife` bundles. For example, in a case like this...

```js
import $ from 'jquery';
```

...we want to tell Rollup that the `jquery` module ID equates to the global `jQuery` variable:

```js
// rollup.config.js
export default {
  ...,
  format: 'iife',
  moduleName: 'MyBundle',
  globals: {
    jquery: 'jQuery'
  }
};

/*
var MyBundle = (function ($) {
  // code goes here
}(window.jQuery));
*/.
```

Alternatively, supply a function that will turn an external module ID into a global.

# Danger Zone

You probably don't need to use these options unless you know what you're doing!


**• treeshake**

Whether or not to apply tree-shaking. It's recommended that you omit this option (defaults to `treeshake: true`), unless you discover a bug caused by the tree-shaking algorithm in which case use `treeshake: false` once you've filed an issue!

**• acorn**

Any options that should be passed through to Acorn, such as `allowReserved: true`.

**• context**

By default, the context of a module – i.e., the value of `this` at the top level – is `undefined`. In rare cases you might need to change this to something else, like `'window'`.

**• moduleContext**

Same as `options.context`, but per-module – can either be an object of `id: context` pairs, or an `id => context` function.

**• legacy**

Adds support for very old environments like IE8, at the cost of some extra code.


**• exports**

`String` What export mode to use. Defaults to `auto`, which guesses your intentions based on what the `entry` module exports:

* `default` – suitable if you're only exporting one thing using `export default ...`
* `named` – suitable if you're exporting more than one thing
* `none` – suitable if you're not exporting anything (e.g. you're building an app, not a library)

The difference between `default` and `named` affects how other people can consume your bundle. If you use `default`, a CommonJS user could do this, for example:

```js
var yourLib = require( 'your-lib' );
```

With `named`, a user would do this instead:

```js
var yourMethod = require( 'your-lib' ).yourMethod;
```

The wrinkle is that if you use `named` exports but *also* have a `default` export, a user would have to do something like this to use the default export:

```js
var yourMethod = require( 'your-lib' ).yourMethod;
var yourLib = require( 'your-lib' )['default'];
```

**• amd** (configuration file only?)

`Object` Can contain the following properties:

* **amd.id** `String` An ID to use for AMD/UMD bundles:

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    id: 'my-bundle'
  }
};

// -> define('my-bundle', ['dependency'], ...
```

* **amd.define** `String` A function name to use instead of `define`:

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    define: 'def'
  }
};

// -> def(['dependency'],...
```

**• indent**

`String` the indent string to use, for formats that require code to be indented (`amd`, `iife`, `umd`). Can also be `false` (no indent), or `true` (the default – auto-indent)

```js
// rollup.config.js
export default {
  ...,
  indent: false
};
```

**• interop**

`Boolean` whether or not to add an 'interop block'. By default (`interop: true`), for safety's sake, Rollup will assign any external dependencies' `default` exports to a separate variable if it's necessary to distinguish between default and named exports. This generally only applies if your external dependencies were transpiled (for example with Babel) – if you're sure you don't need it, you can save a few bytes with `interop: false`.

**• useStrict**

`true` or `false` (defaults to `true`) – whether to include the 'use strict' pragma at the top of generated non-ES6 bundles. Strictly-speaking (geddit?), ES6 modules are *always* in strict mode, so you shouldn't disable this without good reason.