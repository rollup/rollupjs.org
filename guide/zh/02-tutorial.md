---
title: 教程
---

### 创建第一个bundle(Creating your first bundle)

*开始前, 需要安装 [Node.js](https://nodejs.org)， 这样才可以使用 [npm](https://npmjs.com) ；还需要了解如何使用 [command line](https://www.codecademy.com/learn/learn-the-command-line)。*

使用 Rollup 最简单的方法是通过 Command Line Interface （或 CLI）。先全局安装 Rollup （之后会介绍如何在项目中进行安装，更便于打包，但现在不用担心这个问题）。在命令行中输入以下内容：

```bash
npm install rollup --global # or `npm i rollup -g` for short
```

现在可以运行 `rollup` 命令了。试试吧~

```bash
rollup
```

由于没有传递参数，所以 Rollup 打印出了使用说明。这和运行 `rollup --help` 或 `rollup -h` 的效果一样。

我们来创建一个简单的项目：

```bash
mkdir -p my-rollup-project/src
cd my-rollup-project
```

首先，我们需要个 *入口*。将以下代码粘贴到新建的文件 `src/main.js` 中：

```js
// src/main.js
import foo from './foo.js';
export default function () {
  console.log(foo);
}
```

之后创建入口文件引用的 `foo.js` 模块：

```js
// src/foo.js
export default 'hello world!';
```

现在可以创建 bundle 了：

```bash
rollup src/main.js -f cjs
```

`-f` 选项（`--output.format` 的缩写）指定了所创建 bundle 的类型——这里是 CommonJS（在 Node.js 中运行）。由于没有指定输出文件，所以会直接打印在 `stdout` 中：

```js
'use strict';

var foo = 'hello world!';

var main = function () {
  console.log(foo);
};

module.exports = main;
```

也可以像下面一样将 bundle 保存为文件：

```bash
rollup src/main.js -o bundle.js -f cjs
```

（你也可以用 `rollup src/main.js -f cjs > bundle.js`，但是我们之后会提到，这种方法在生成 sourcemap 时灵活性不高。）

试着运行下面的代码：

```bash
node
> var myBundle = require('./bundle.js');
> myBundle();
'hello world!'
```

恭喜，你已经用 Rollup 完成了第一个 bundle。

### 使用配置文件(Using config files)

上面的方式还不错，但是如果添加更多的选项，这种命令行的方式就显得麻烦了。

为此，我们可以创建配置文件来囊括所需的选项。配置文件由 JavaScript 写成，比 CLI 更加灵活。

在项目中创建一个名为 `rollup.config.js` 的文件，增加如下代码：

```js
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};
```
 
我们用 `--config` 或 `-c` 来使用配置文件：

```bash
rm bundle.js # so we can check the command works!
rollup -c
```

同样的命令行选项将会覆盖配置文件中的选项：

```bash
rollup -c -o bundle-2.js # `-o` is short for `--output.file`
```

（注意 Rollup 本身会处理配置文件，所以可以使用 `export default` 语法——代码不会经过 Babel 等类似工具编译，所以只能使用所用 Node.js 版本支持的 ES2015 语法。）

如果愿意的话，也可以指定与默认 `rollup.config.js` 文件不同的配置文件：

```bash
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```

### 使用插件(Using plugins)

目前为止，我们通过相对路径，将一个入口文件和一个模块创建成了一个简单的 bundle。随着构建更复杂的 bundle，通常需要更大的灵活性——引入 npm 安装的模块、通过 Babel 编译代码、和 JSON 文件打交道等。

为此，我们可以用 *插件(plugins)* 在打包的关键过程中更改 Rollup 的行为。[the Rollup wiki](https://github.com/rollup/rollup/wiki/Plugins) 维护了可用的插件列表。

此教程中，我们将使用 [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json)，令 Rollup 从 JSON 文件中读取数据。

将 rollup-plugin-json 安装为开发依赖：

```bash
npm install --save-dev rollup-plugin-json
```

（我们用的是 `--save-dev` 而不是 `--save`，因为代码实际执行时不依赖这个插件——只是在打包时使用。）

更新 `src/main.js` 文件，从 package.json 而非 `src/foo.js` 中读取数据：

```js
// src/main.js
import { version } from '../package.json';

export default function () {
  console.log('version ' + version);
}
```

编辑 `rollup.config.js` 文件，加入 JSON 插件：

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ json() ]
};
```

`npm run build` 执行 Rollup。结果如下：

```js
'use strict';

var version = "1.0.0";

var main = function () {
  console.log('version ' + version);
};

module.exports = main;
```

（注意只有我们实际需要的数据——name 和 devDependencies 和 package.json 中的其它数据被忽略了。这是 tree-shaking 起了作用。）