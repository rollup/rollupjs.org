---
title: Getting started with plugins
---

So far, we've created a simple bundle from an entry point and a module imported via a relative path. As you build more complex bundles, you'll often need more flexibility – importing modules installed with npm, compiling code with Babel, working with JSON files and so on.

For that, we use *plugins*, which change the behaviour of Rollup at key points in the bundling process. A list of available plugins is maintained on [the Rollup wiki](https://github.com/rollup/rollup/wiki/Plugins).

### Using plugins

For this tutorial, we'll use [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json), which allows Rollup to import data from a JSON file.

Install rollup-plugin-json as a development dependency:

```bash
npm install --save-dev rollup-plugin-json
```

(We're using `--save-dev` rather than `--save` because our code doesn't actually depend on the plugin when it runs – only when we're building the bundle.)

Update your `src/main.js` file so that it imports from your package.json instead of `src/foo.js`:

```js
// src/main.js
import { version } from '../package.json';

export default function () {
  console.log('version ' + version);
}
```

Edit your `rollup.config.js` file to include the JSON plugin:

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ json() ],
  dest: 'bundle.js'
};
```

Run Rollup with `npm run build`. The result should look like this:

```js
'use strict';

var version = "1.0.0";

var main = function () {
  console.log('version ' + version);
};

module.exports = main;
```

(Notice that only the data we actually need gets imported – `name` and `devDependencies` and other parts of `package.json` are ignored. That's [tree-shaking](#what-is-tree-shaking-) in action!)

***

> 原文：https://rollupjs.org/#getting-started-with-plugins