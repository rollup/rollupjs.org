---
title: Using Rollup with Babel
---

Many developers use [Babel](https://babeljs.io/) in their projects, so that they can use futuristic JavaScript features that aren't yet supported by browsers and Node.js.

The easiest way to use both Babel and Rollup is with [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel). Install it:

```bash
npm i -D rollup-plugin-babel
```

Add it to `rollup.config.js`:

```js
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ json(), babel() ],
  dest: 'bundle.js'
};
```

Before Babel will actually compile your code, it needs to be configured. Create a new file, `src/.babelrc`:

``js
{
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ]
  ],
  "plugins": ["external-helpers"]
}
```

There are a few unusual things about this setup. First, we're setting `"modules": false`, otherwise Babel will convert our modules to CommonJS before Rollup gets a chance to do its thing, causing it to fail.

Secondly, we are using the `external-helpers` plugin, which allows Rollup to include any 'helpers' just once at the top of the bundle, rather than including them in every module that uses them (which is the default behaviour).

Thirdly, we're putting our `.babelrc` file in `src`, rather than the project root. This allows us to have a different `.babelrc` for things like tests, if we need that later – it's generally a good idea to have separate configuration for separate tasks.

Now, before we run rollup, we need to install the `es2015` preset and the `external-helpers` plugin:

```bash
npm i -D babel-preset-es2015 babel-plugin-external-helpers
```

Running Rollup now will create a bundle... except we're not actually using any ES2015 features. Let's change that. Edit `src/main.js`:

```js
import { version } from '../package.json';

const message = `current version is ${version}`;
export default () => console.log( message );
```

Try now – Rollup should create a bundle like this:

```js
'use strict';

var version = "1.0.0";

var message = 'current version is ' + version;
var main = (function () {
  return console.log(message);
})

module.exports = main;
```
