---
title: Rollup 与其他工具集成
---

### npm packages

在某些时候，你的项目很可能依赖于从 npm 安装到你的 `node_modules` 文件夹中的软件包。 与 Webpack 和 Browserify 这样的其他捆绑包不同，Rollup 不知道如何打破常规去处理这些依赖。 - 我们需要添加一些配置。

让我们添加一个简单的依赖 [the-answer](https://www.npmjs.com/package/the-answer)，它输出对生活、宇宙及其它一切的答案

```bash
npm install the-answer # or `npm i the-answer`
```

如果修改我们的 `src/main.js` 入口文件...

```js
// src/main.js
import answer from 'the-answer';

export default function () {
  console.log('the answer is ' + answer);
}
```

...然后执行 Rollup...

```bash
npm run build
```

...我们将会看到下面这些警告：

```
(!) Unresolved dependencies
https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
the-answer (imported by main.js)
```

打包后的 `bundle.js` 仍然会在 Node.js 中工作，因为 `import` 声明转变成了 CommonJS 中的 `require` 语句，但是 `the-answer` 不包含在包中。因此，我们需要一个插件。

#### rollup-plugin-node-resolve

这个 [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 插件可以告诉 Rollup 如何查找外部模块。
安装它...

```bash
npm install --save-dev rollup-plugin-node-resolve
```

...将它加入到你的配置文件中:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ resolve() ]
};
```

这次，当你运行 `npm run build` , 再没有警告输出 - 打包文件 bundle 包含了引用的模块。

#### rollup-plugin-commonjs

一些库导出成你可以正常导入的 ES6 模块 - `the-answer` 就是一个这样的模块。 但是目前， npm 中的大多数包都是以 CommonJS 模块的形式出现的。 在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。

这个 [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 插件就是用来将 CommonJS 转换成 ES2015 模块的。

请注意， `rollup-plugin-commonjs` 应该用在其他插件转换你的模块*之前* - 这是为了防止其他插件的改变破坏 CommonJS 的检测。

### Peer dependencies

假设你正在构建一个具有对等依赖关系（peer dependency）的库，例如 React 或 Lodash 。 如果你如上所述设置外部引用（externals），你的 Rollup 将把 所有 imports 的模块打包在一起：

```js
import answer from 'the-answer';
import _ from 'lodash';
```

你可以微调哪些导入是想要打包的，哪些是外部的引用（externals）。 对于这个例子，我们认为 `lodash` 是外部的引用（externals），而不是 `the-answer` 。

这是配置文件:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [resolve({
    // 将自定义选项传递给解析插件
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // 指出应将哪些模块视为外部模块
  external: ['lodash']
};
```

这样， `lodash` 现在将被视为外部的（externals），不会与你的库打包在一起。

`external` 接受一个模块名称的数组或一个接受模块名称的函数，如果它被视为外部引用（externals）则返回 true 。 例如：

```js
export default {
  // ...
  external: id => /lodash/.test(id)
}
```

如果你使用 [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) 来最优选择 `lodash` 模块，在这种情况下， Babel 将转换你的导入语句，如下所示

```js
import _merge from 'lodash/merge';
```

`external` 的数组形式不会处理通配符，所以这个导入只会以函数的形式被视作外部依赖/引用（externals）。

### Babel

许多开发人员在他们的项目中使用 [Babel](https://babeljs.io/) ，以便他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。

使用 Babel 和 Rollup 的最简单方法是使用 [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel) 。 安装它：

```bash
npm i -D rollup-plugin-babel
```

添加到 Rollup 配置文件 `rollup.config.js`:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};
```

在 Babel 实际编译代码之前，需要进行配置。 创建一个新文件`src/.babelrc`：

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

这个设置有一些不寻常的地方。首先，我们设置 `"modules": false` ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。

其次，我们使用 `external-helpers` 插件，它允许 Rollup 在包的顶部只引用一次 `helpers` ，而不是每个使用它们的模块中都引用一遍（这是默认行为）。

第三，我们将 `.babelrc` 文件放在 `src` 中，而不是根目录下。 这允许我们对于不同的任务有不同的 `.babelrc` 配置，比如像测试，如果我们以后需要的话 - 通常为单独的任务单独配置会更好。

现在，在我们运行 rollup 之前，我们需要安装 `latest` preset 和 `external-helpers` 插件

```bash
npm i -D babel-preset-latest babel-plugin-external-helpers
```

运行 Rollup 现在将创建一个 bundle 包... 实际上我们并没有使用任何ES2015特性。 我们来改变一下。 编辑 `src / main.js` ：

```js
// src/main.js
import answer from 'the-answer';

export default () => {
  console.log(`the answer is ${answer}`);
}
```

运行 Rollup `npm run build`，检查打包后的 bundle ：

```js
'use strict';

var index = 42;

var main = (function () {
  console.log('the answer is ' + index);
});

module.exports = main;
```

### Gulp

Rollup 返回 gulp 能明白的 promises，所以集成是很容易的。

语法与配置文件非常相似，但属性分为两个不同的操作，对应于[JavaScript API](guide/zh#javascript-api)：

```js
const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

gulp.task('build', async function () {
  const bundle = await rollup.rollup({
    input: './src/main.ts',
    plugins: [
      rollupTypescript()
    ]
  });

  await bundle.write({
    file: './dist/library.js',
    format: 'umd',
    name: 'library',
    sourcemap: true
  });
});
```
