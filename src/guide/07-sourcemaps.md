---
title: Sourcemaps
---

Sourcemaps can be enabled by adding the `--sourcemap` flag using the command line too, or by adding `sourceMap: true` to your configuration file.

```js
export default {
  entry: 'src/main.js',
  format: 'umd',
  dest: 'bundle.js',
  sourceMap: true
};
```
