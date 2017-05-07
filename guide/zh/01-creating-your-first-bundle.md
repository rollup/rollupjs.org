---
title: 创建你的第一个文件束(bundle)
---

*在我们开始前，你将需要安装 [Node.js](https://nodejs.org) 那样你才可以使用 [npm](https://npmjs.com)。你也将会需要知道如何在你的机器上使用 [command line](https://www.codecademy.com/learn/learn-the-command-line)。*

最容易的办法去使用 Rollup 是通过命令行界面 (or CLI). 现在，我们将全局安装它(稍后我们将会学习如何在你的本地项目安装，因而令你的构建流程是可移植的，但现在可以暂时不要担忧这点)。 在命令行中输入:

```bash
npm install rollup --global # 或简写 `npm i rollup -g`
```

你现在可以运行 `rollup` 命令。来试试!

```bash
rollup
```

因为没有参数被传入，Rollup 输出使用指引。这跟运行 `rollup --help`, or `rollup -h` 如出一辙。

让我们新建一个简单的项目:

```bash
mkdir -p my-rollup-project/src
cd my-rollup-project
```

首先，我们需要一个 *入口文件(entry point)*. 粘贴下面这段代码到一个新的文件里，名为 `src/main.js`:

```js
// src/main.js
import foo from './foo.js';
export default function () {
  console.log(foo);
}
```

然后，让我们创建 `foo.js` 文件模块，我们的入口文件会引入:

```js
// src/foo.js
export default 'hello world!';
```

现在，我们已经准备好要创建一个文件束了：

```bash
rollup src/main.js --format cjs
```

`--format` 参数指定我们正在创建的文件束类型 — 在这个事例中，CommonJS (能在 Node.js 中运行).因为我们没有指定输出文件，它的内容将会被直接输出到 `stdout`：

```js
'use strict';

var foo = 'hello world!';

var main = function () {
  console.log(foo);
};

module.exports = main;
```

你可以像这样将文件束另存为文件：

```bash
rollup src/main.js --format cjs --output bundle.js
# or `rollup main.js -f cjs -o bundle.js`
```

(你也可以用 `rollup src/main.js > bundle.js`, 但后面我们将会看到，如果你会生成 sourcemaps，这种办法将不太灵活。)

尝试跑下面代码:

```bash
node
> var myBundle = require('./bundle.js');
> myBundle();
'hello world!'
```

恭喜你！你已经使用 Rollup创建了你的第一个文件束。

***

> 原文：https://rollupjs.org/#creating-your-first-bundle