---
title: Integrating Rollup With Other Tools
---

### With NPM Packages

At some point, it's very likely that your project will depend on packages installed from NPM into your `node_modules` folder. Unlike other bundlers such as Webpack and Browserify, Rollup doesn't know "out of the box" how to handle these dependencies - we need to add some configuration.

Let's add a simple dependency called [the-answer](https://www.npmjs.com/package/the-answer), which exports the answer to the question of life, the universe and everything:

```console
npm install the-answer
# or `npm i the-answer`
```

If we update our `src/main.js` file...

```js
// src/main.js
import answer from 'the-answer';

export default function () {
  console.log('the answer is ' + answer);
}
```

...and run Rollup...

```console
npm run build
```

...we'll see a warning like this:

```
(!) Unresolved dependencies
https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
the-answer (imported by main.js)
```

The resulting `bundle.js` will still work in Node.js, because the `import` declaration gets turned into a CommonJS `require` statement, but `the-answer` does *not* get included in the bundle. For that, we need a plugin.


#### rollup-plugin-node-resolve

The [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) plugin teaches Rollup how to find external modules. Install it...

```console
npm install --save-dev rollup-plugin-node-resolve
```

...and add it to your config file:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ resolve() ]
};
```

This time, when you `npm run build`, no warning is emitted — the bundle contains the imported module.


#### rollup-plugin-commonjs

Some libraries expose ES6 modules that you can import as-is — `the-answer` is one such module. But at the moment, the majority of packages on NPM are exposed as CommonJS modules instead. Until that changes, we need to convert CommonJS to ES2015 before Rollup can process them.

The [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) plugin does exactly that.

Note that `rollup-plugin-commonjs` should go *before* other plugins that transform your modules — this is to prevent other plugins from making changes that break the CommonJS detection.


### Peer dependencies

Let's say that you're building a library that has a peer dependency, such as React or Lodash. If you set up externals as described above, your rollup will bundle *all* imports:

```js
import answer from 'the-answer';
import _ from 'lodash';
```

You can finely tune which imports are bundled and which are treated as external. For this example, we'll treat `lodash` as external, but not `the-answer`.

Here is the config file:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [resolve({
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // indicate which modules should be treated as external
  external: ['lodash']
};
```

Voila, `lodash` will now be treated as external, and not be bundled with your library.

The `external` key accepts either an array of module names, or a function which takes the module name and returns true if it should be treated as external. For example:

```js
export default {
  // ...
  external: id => /lodash/.test(id)
}
```

You might use this form if you're using [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) to cherry-pick `lodash` modules. In this case, Babel will convert your import statements to look like this:

```js
import _merge from 'lodash/merge';
```

The array form of `external` does not handle wildcards, so this import will only be treated as external in the functional form.


### Babel

Many developers use [Babel](https://babeljs.io/) in their projects in order to use the latest JavaScript features that aren't yet supported by browsers and Node.js.

The easiest way to use both Babel and Rollup is with [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel). First; install the plugin:

```console
npm i -D rollup-plugin-babel rollup-plugin-node-resolve
```

Add it to `rollup.config.js`:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
```

Before Babel will actually compile your code, it needs to be configured. Create a new file, `src/.babelrc`:

```js
{
  "presets": [
    ["@babel/env", {
      "modules": false
    }]
  ],
}
```

There are a few unusual elements to this setup. First, we're setting `"modules": false`, otherwise Babel will convert our modules to CommonJS before Rollup gets a chance to do its thing, causing it to fail.

Secondly; we're using the `external-helpers` plugin, which allows Rollup to include any 'helpers' just once at the top of the bundle, rather than including them in every module that uses them (which is the default behaviour).

Thirdly; we're putting our `.babelrc` file in `src`, rather than the project root. This allows us to have a different `.babelrc` for things like tests, if we need that later – it's generally a good idea to have separate configuration for separate tasks.

Now, before we run rollup, we need to install
[`babel-core`](https://babeljs.io/docs/en/babel-core)
and the
[`env`](https://babeljs.io/docs/en/babel-preset-env)
preset:

```console
npm i -D @babel/core @babel/preset-env
```

Running Rollup now will create a bundle - except we're not actually using any ES2015 features. Let's change that by editing `src/main.js`:

```js
// src/main.js
import answer from 'the-answer';

export default () => {
  console.log(`the answer is ${answer}`);
}
```

Run Rollup with `npm run build`, and check the bundle:

```js
'use strict';

var index = 42;

var main = (function () {
  console.log('the answer is ' + index);
});

module.exports = main;
```

### Gulp

Rollup returns Promises which are understood by gulp so integration is relatively painless.

The syntax is very similar to the configuration file, but the properties are split across two different operations corresponding to the [JavaScript API](guide/en#javascript-api):

```js
const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

gulp.task('build', () => {
  return rollup.rollup({
    input: './src/main.ts',
    plugins: [
      rollupTypescript()
    ]
  }).then(bundle => {
    return bundle.write({
      file: './dist/library.js',
      format: 'umd',
      name: 'library',
      sourcemap: true
    });
  });
});
```

You may also use the `async/await` syntax:

```js
const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

gulp.task('build', async function () {
  const bundle = await rollup.rollup({
    input: './src/main.ts',
    plugins: [
      rollupTypescript()
    ]
  });

  await bundle.write({
    file: './dist/library.js',
    format: 'umd',
    name: 'library',
    sourcemap: true
  });
});
```
