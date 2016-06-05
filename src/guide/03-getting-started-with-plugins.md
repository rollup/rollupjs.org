---
title: Getting started with plugins
---

So far, we've created a simple bundle from an entry point and a module imported via a relative path. As you build more complex bundles, you'll often need more flexibility – importing modules installed with npm, compiling code with Babel, working with JSON files and so on.

For that, we use *plugins*, which change the behaviour of Rollup at key points in the bundling process. A list of available plugins is maintained on [the Rollup wiki](https://github.com/rollup/rollup/wiki/Plugins).

### Using plugins

For this tutorial, we'll use [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json), which allows Rollup to import data from a JSON file.

We'll start by adding a `package.json` file to our project. A `package.json` file contains essential metadata about your project, such as the current version, and which other packages it depends on:

```js
{
  "name": "my-rollup-project",
  "version": "1.0.0"
}
```

Now, install rollup-plugin-json as a *development dependency*:

```bash
npm install --save-dev rollup-plugin-json # or npm i -D rollup-plugin-json
```

(We're using `--save-dev` rather than `--save` because our code doesn't actually depend on the plugin when it runs – only when we're building the bundle.)

Take a look at your `package.json`. It should look something like this:

```js
{
  "name": "my-rollup-project",
  "version": "1.0.0",
  "devDependencies": {
    "rollup-plugin-json": "^2.0.0"
  }
}
```

Delete `src/foo.js`, and replace the contents of `src/main.js` with the following:

```js
import { version } from '../package.json';
export default function () {
  console.log('current version is ' + version);
}
```

Edit your `rollup.config.js` file to include the JSON plugin:

```js
import json from 'rollup-plugin-json';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ json() ],
  dest: 'bundle.js'
};
```

Run Rollup with `rollup -c`. The result should look like this:

```js
'use strict';

var version = "1.0.0";

function main () {
  console.log('current version is ' + version);
}

module.exports = main;
```

(Notice that only the data we actually need gets imported – the `name` and `devDependencies` parts of the `package.json` are ignored. That's [tree-shaking](#what-is-tree-shaking-) in action!)
