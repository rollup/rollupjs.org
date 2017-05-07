---
title: 使用 Rollup 和 Babel
---

许多开发者在他们的项目中使用 [Babel](https://babeljs.io/)，因此他们可以用上那些未被浏览器和 Node.js 支持的未来的 JavaScript 特性。

最容易的办法去同时使用 Babel 和 Rollup 是使用 [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel). 安装它:

```bash
npm i -D rollup-plugin-babel
```

将它添加到 `rollup.config.js` 里面:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 仅仅转译我们的源码
    })
  ],
  dest: 'bundle.js'
};
```

在 Babel 将编译你的代码前，它需要被配置。新建一个文件 `src/.babelrc`：

```js
{
  "presets": [
    ["latest", {
      "es2015": {
        "modules": false
      }
    }]
  ],
  "plugins": ["external-helpers"]
}
```

这里有几个关于配置的与不常不同的事情。首先我们设置 `"modules": false`，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS，导致 Rollup 的一些处理失败。

第二，我们使用 `external-helpers` 插件，它允许 Rollup 在文件束前仅引用一次任何的 'helpers' 函数，而不是在每个使用这些 'helpers' 的模块里都引入一遍（一般是默认行为）。

第三，我们将 `.babelrc` 文件放到 `src` 目录下，而非项目根目录。这允许我们可以有另一个 `.babelrc` 文件给一些别的操作，像测试，如果我们真的在后面需要的话 - 通常给不同的任务做不同的配置会更好。

现在，我们运行 rollup 前，我们需要安装 `latest` preset 和 `extternal-helpers` 插件：

```bash
npm i -D babel-preset-latest babel-plugin-external-helpers
```

现在运行 Rollup 会创建一个文件束...除了我们并没有使用任何 ES2015 的特性。让我们改一下，编辑 `src/main.js`:

```js
// src/main.js
import answer from 'the-answer';

export default () => {
  console.log(`the answer is ${answer}`);
}
```

使用 `npm run build` 运行 Rollup, 同时检查一下文件束：

```js
'use strict';

var index = 42;

var main = (function () {
  console.log('the answer is ' + index);
});

module.exports = main;
```

***

> 原文：https://rollupjs.org/#using-rollup-with-babel