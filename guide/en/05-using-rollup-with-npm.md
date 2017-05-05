---
title: Using Rollup with npm packages
---

At some point, it's very likely that your project will depend on packages installed from npm into your `node_modules` folder. Unlike other bundlers like Webpack and Browserify, Rollup doesn't know 'out of the box' how to handle these dependencies - we need to add some configuration.

Let's add a simple dependency called [the-answer](https://www.npmjs.com/package/the-answer), which exports the answer to the question of life, the universe and everything:

```bash
npm install --save the-answer # or `npm i -S the-answer`
```

Notice that we used `--save` this time, so that it's stored in the `dependencies` section of package.json.

If we update our `src/main.js` file...

```js
// src/main.js
import answer from 'the-answer';

export default function () {
  console.log('the answer is ' + answer);
}
```

...and run Rollup...

```bash
npm run build
```

...we'll see a warning like this:

```
⚠️ 'the-answer' is imported by src/main.js, but could not be resolved – treating it as an external dependency
```

The resulting `bundle.js` will still work in Node.js, because the `import` declaration gets turned into a CommonJS `require` statement, but `the-answer` does *not* get included in the bundle. For that, we need a plugin.


### rollup-plugin-node-resolve

The [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) plugin teaches Rollup how to find external modules. Install it...

```bash
npm install --save-dev rollup-plugin-node-resolve
```

...and add it to your config file:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ resolve() ],
  dest: 'bundle.js'
};
```

This time, when you `npm run build`, no warning is emitted — the bundle contains the imported module.


### rollup-plugin-commonjs

Some libraries expose ES6 modules that you can import as-is — `the-answer` is one such module. But at the moment, the majority of packages on npm are exposed as CommonJS modules instead. Until that changes, we need to convert CommonJS to ES2015 before Rollup can process them.

The [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) plugin does exactly that.

Note that `rollup-plugin-commonjs` should go *before* other plugins that transform your modules — this is to prevent other plugins from making changes that break the CommonJS detection.


## Peer dependencies

Let's say that you're building a library that has a peer
dependency, such as React or Lodash. If you set up externals
as described above, your rollup will bundle *all* imports:

```js
import answer from 'the-answer';
import _ from 'lodash';
```

You can finely tune which imports are bundled and which
are treated as external. For this example, we'll treat
`lodash` as external, but not `the-answer`.

Here is the config file:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [resolve({
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // indicate which modules should be treated as external
  external: ['lodash'],
  dest: 'bundle.js'
};
```

Voila, `lodash` will now be treated as external, and
not be bundled with your library.

The `external` key accepts either an array of module names
or a function which takes the module name and returns true
if it should be treated as external. For example:

```js
export default {
  // ...
  external: id => /lodash/.test(id)
}
```

You might use this form if you're using
[babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
to cherry-pick lodash modules. In this case, Babel will
convert your import statements to look like this:

```js
import _merge from 'lodash/merge';
```

The array form of `external` does not handle wildcards, so
this import will only be treated as external in the functional
form.

***

> 原文：https://rollupjs.org/#using-rollup-with-npm