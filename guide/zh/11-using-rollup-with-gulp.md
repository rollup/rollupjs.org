---
title: 使用 Rollup 和 Gulp
---

Rollup 返回 promise 对象，gulp 能够识别，因此整合起来非常容易。

语法跟配置文件很想似，但属性会被拆开成两个运行步骤。构建文件束，转译成目标的输出文件。

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

***

> 原文：https://rollupjs.org/#using-rollup-with-gulp