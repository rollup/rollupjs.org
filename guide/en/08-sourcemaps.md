---
title: Sourcemaps
---

Sourcemaps 可以通过在命令行界面中添加  `--sourcemap` 参数被启用，或者在你的配置文件中添加 `sourceMap: true`。

```js
export default {
  entry: 'src/main.js',
  format: 'umd',
  dest: 'bundle.js',
  sourceMap: true
};
```

***

> 原文：https://rollupjs.org/#sourcemaps