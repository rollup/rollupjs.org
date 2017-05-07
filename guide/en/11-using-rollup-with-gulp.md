---
title: Using RollupJS with Gulp
---

Rollup returns promises which are understood by gulp so integration is easy.

The syntax is very similar to the configuration file, but the properties are split across two different operations. Constructing the bundle, and transpiling to a target output.

```js
var gulp = require('gulp'),
  rollup = require('rollup'),
  rollupTypescript = require('rollup-plugin-typescript')
;

gulp.task('build', function () {
  return rollup.rollup({
    entry: "./src/main.ts",
    plugins: [
      rollupTypescript()
    ],
  })
    .then(function (bundle) {
      bundle.write({
        format: "umd",
        moduleName: "library",
        dest: "./dist/library.js",
        sourceMap: true
      });
    })
});
```
