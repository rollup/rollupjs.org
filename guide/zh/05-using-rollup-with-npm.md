---
title: 使用 Rollup 和 npm 程序包
---

某些时候，很可能你的项目会依赖于 npm 安装到 `node_modules` 文件夹中的程序包。跟其它打包工具如 Webpack 和 Browserify 不同，Rollup 不知道如何去开箱即用地处理这些依赖 - 我们需要添加一些配置。

让我们添加一个简单的依赖，叫 [the-answer](https://www.npmjs.com/package/the-answer), 它输出对生活、宇宙及其它一切的答案：

```bash
npm install --save the-answer # or `npm i -S the-answer`
```

注意我们这次使用 `--save`，因为这样它会被保存到 package.json 的 `dependencies` 部份。

如果我们更新 `src/main.js` 文件...


```js
// src/main.js
import answer from 'the-answer';

export default function () {
  console.log('the answer is ' + answer);
}
```

...运行 Rollup...

```bash
npm run build
```

...我们会看到下面的警告：

```
⚠️ 'the-answer' is imported by src/main.js, but could not be resolved – treating it as an external dependency
⚠️ 'the-answer' 被 src/main.js 引用，但不知道如何去解析 - 把它看作是外部的以来
```

生成的 `bundle.js` 在 Node.js 中仍然能运行，因为 `import` 声明被编译为 CommonJS 的 `require` 语句，但 `the-answer` *并没有* 被打包到文件束中。为此，我们需要一个插件。


### rollup-plugin-node-resolve

[rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 插件指导 Rollup 如果去寻找外部的模块。请安装...

```bash
npm install --save-dev rollup-plugin-node-resolve
```

...将它添加到你的配置文件中:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ resolve() ],
  dest: 'bundle.js'
};
```

这次，当你运行 `npm run build`, 再没有警告输出 - 文件束包含了引用的模块。


### rollup-plugin-commonjs

一些库输出 ES6 模块，你可以照原来的样子引用 - `the-answer` 正是这样的一个模块。但当下，大部份 npm 的程序包都被输出为 CommonJS 模块。直到它改变，在 Rollup 处理它们之前，我们都需要将 CommonJS 转成 ES2015。

[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 插件就正好来处理这件事。

注意 `rollup-plugin-commonjs` 应该在其它插件变换你的模块之前使用 - 这是为了避免其它插件做了一些改变，而这改变会破坏了 CommonJS 的检测。


## Peer dependencies

比方说，你正在开发一个有 peer dependency 的库，例如 React 或者 Lodash。如果你像上面描述的那样设置 externals，你的 rollup 会打包 *所有的* 引用：

```js
import answer from 'the-answer';
import _ from 'lodash';
```

你可以很好地调整哪些需要被打包，哪些应该看作外部引用 (external)。在这个例子里，我们把 `lodash` 看作外部引用(external)，而不是 `ths-answer`。这里是配置文件：

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [resolve({
    // 给 resolve 插件传入自定配置
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // 指明哪个模块被看作外部引用(external)
  external: ['lodash'],
  dest: 'bundle.js'
};
```

看, `lodash` 现在被看成外部引用(external)，而没有被打包进你的库中。

`external` 参数接受一个模块名称的数组，或者一个函数，这个函数接收模块名，如果它被看作外部引用(external)，会返回 true。例如：

```js
export default {
  // ...
  external: id => /lodash/.test(id)
}
```

你可能会使用这个形式的插件 [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) 去择优挑选 lodash 模块。这个请况下， Babel 会将你的引用语句转化成如下代码：

```js
import _merge from 'lodash/merge';
```

如果 `external` 是数组形式，它不会处理通配符(*)，所以这种引用只有在函数形式的时候，才会被看作外部引用(external)。

***

> 原文：https://rollupjs.org/#using-rollup-with-npm
