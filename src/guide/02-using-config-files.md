---
title: Using config files
---

So far, so good, but as we start adding more options it becomes a bit of a nuisance to type out the command.

To save repeating ourselves, we can create a config file containing all the options we need. A config file is written in JavaScript and is more flexible than the raw CLI.

Create a file in the project root called `rollup.config.js`, and add the following code:

```js
// rollup.config.js
export default {
  entry: 'src/main.js',
  format: 'cjs',
  dest: 'bundle.js' // equivalent to --output
};
```

To use the config file, we use the `--config` or `-c` flag:

```bash
rm bundle.js # so we can check the command works!
rollup -c
```

You can override any of the options in the config file with the equivalent command line options:

```bash
rollup -c -o bundle-2.js # --output is equivalent to dest
```

(Note that Rollup itself processes the config file, which is why we're able to use `export default` syntax – the code isn't being transpiled with Babel or anything similar, so you can only use ES2015 features that are supported in the version of Node.js that you're running.)

You can, if you like, specify a different config file from the default `rollup.config.js`:

```bash
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```

***

> 原文：https://rollupjs.org/#using-config-files