---
title: Používanie Rollupu spolu s Gulp
---

Rollup vracia funkcie Promise, s ktorými je Gulp oboznámený, takže integrácia je jednoduchá.

Syntax je podobný konfiguračným súborom, ale vlastnosti sú rozdelené spomedzi dvoch rôznych operácií: tvorba balíčka a transpilácia do konečného výstupu.

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
        file: "./dist/library.js",
        format: "umd",
        name: "library",
        sourcemap: true
      });
    })
});
```
