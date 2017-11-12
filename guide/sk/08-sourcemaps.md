---
title: Zdrojové mapy
---

Tvorba zdrojových máp môže byť povolená pridaním možnosti `--sourcemap` počas používania príkazového riadku, alebo pridaním `sourceMap: true` do konfiguračného súboru.

```js
export default {
  entry: 'src/main.js',
  format: 'umd',
  dest: 'bundle.js',
  sourceMap: true
};
```
