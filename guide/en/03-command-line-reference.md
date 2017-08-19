---
title: Command Line Interface
---

Rollup should typically be used from the command line. You can provide an optional Rollup configuration file to simplify command line usage and enable advanced Rollup functionality.

### Configuration Files

Rollup configuration files are optional, but they are powerful and convenient and thus **recommended**.

A config file is an ES6 module that exports a default object with the desired options. Typically, it is called `rollup.config.js` and sits in the root directory of your project.

```javascript
// rollup.config.js
let configuration = {
  // configuration options go here...
};
export default configuration;
```

You *must* use a configuration file in order to do any of the following:

- bundle one project into multiple output files
- use Rollup plugins
- *use the [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) and [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) plugins, which together let you load CommonJS modules from the Node.js ecosystem*

To use Rollup with a configuration file, pass the `--config` or `-c` flags.

```bash
# use Rollup with a rollup.config.js file
$ rollup --config

# alternatively, specify a custom config file location
$ rollup --config my.config.js
```

### Core Functionality

**• --input / -i** *string* (required)

The entry point file from which to start compilation and resolution of dependencies. This is likely identical to the `module` field in your package.json file.

From the command line:

```bash
# bundle app.js and all dependencies
$ rollup --input app.js
```

```javascript
// rollup.config.js
let configuration = {
  input: './app.js'
};
```

**• --output / -o** *string*

The output filename into which to save the bundle. If this is omitted, output will be sent to stdout.

From the command line:

```bash
# bundle app.js and all dependencies
$ rollup --input app.js --output app-bundled.js
```

```javascript
// rollup.config.js
let configuration = {
  output: './app-bundled.js'
};
```

**• --format / -f** *string* (required)

The target output format to bundle the input code into.

- `iife`: an *immediately-invoked function expression*, typically used from within a `<script>` tag.
- `cjs`: a [CommonJS module](https://en.wikipedia.org/wiki/CommonJS) like those popularized by Node.js, webpack, and browserify.
- `amd`: an [Asynchronous Module Definition](http://requirejs.org/docs/whyamd.html) as popularized by [RequireJS](http://requirejs.org/).
- `umd`: a [Universal Module Definition](https://github.com/umdjs/umd) which is usable either from within a `<script>` tag, as a CommonJS module, or as an AMD module. Because it's so flexible, this is the *recommended option*, but it requires that you also specify a module name as described below.
- `es`: bundles your multiple ES6 modules into a single ES6 module.

```bash
# bundle app.js into iife format
$ rollup --input app.js --format iife
```

```javascript
// rollup.config.js
let configuration = {
  entry: './app.js',
  format: 'iife'
};
```

**• plugins** *array* (configuration files only)

An array of Rollup plugins that should be used to transform the bundle code. The plugins are functions when imported, but the functions *must to be called* in order for the plugin to work.

For example, to enable import of CommonJS modules such as those from the Node.js ecosystem, add the following to your Rollup configuration file:

```javascript
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let configuration = {
  plugins: [
    resolve(),
    commonjs()
  ]
};
export default configuration;
```

**• --name / -n** *string*

A module name is required when you are bundling to a UMD module. This string will be used as the global variable name of the module when it is loaded in a browser through a `<script>` tag.

```bash
# bundle app.js to UMD format
$ rollup --input app.js --format umd --name mymodule
```

```javascript
// rollup.config.js
let configuration = {
  entry: './app.js',
  format: 'umd',
  name: 'mymodule'
};
```

**• --sourcemap / -m ** *string*

Generates a sourcemap which maps the output bundle back to the input source code, so that error messages and `console.log` calls will report the original line number.

- `inline`: the sourcemap will be embedded in the existing output file as a data URI.
- `true`: the sourcemap will be created in a separate file, by default named after whatever output filename is specified with `--output`/`dest`. You can also specify an alternate filename for the sourcemap using the `--sourcemapfile` option.

If you don't pass a value for this option, it defaults to `true`.

```bash
# bundle app.js to iife format with inline sourcemap included
$ rollup --input app.js --format iife --sourcemap inline
```

```javascript
// rollup.config.js
let configuration = {
  sourcemap: 'inline'
};
```

For more advanced use cases, consult the [exhaustive list of command line options](https://rollupjs.org/#big-list-of-options).