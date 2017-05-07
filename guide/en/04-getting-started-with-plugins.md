---
title: 插件的开始
---

到目前为止，我们已经从一个入口点和通过相对路径导入的模块创建了一个简单的bundle。当您需要构建更为复杂的bundle时，您通常需要更多的灵活性 - 例如导入使用npm来安装的模块、使用Babel编译代码、使用JSON文件等等。

针对以上原因，我们使用了 *插件*，它可以在打包过程的关键点改变Rollup的行为。在[the Rollup wiki](https://github.com/rollup/rollup/wiki/Plugins)上维护了可用插件的列表。

### 使用插件

在本教程中，我们将使用[rollup-plugin-json](https://github.com/rollup/rollup-plugin-json)作为例子，它允许Rollup从JSON文件导入数据。

首先安装rollup-plugin-json作为开发依赖：

```bash
npm install --save-dev rollup-plugin-json
```

（我们使用`--save-dev`而不是`--save`，因为我们的代码实际上在运行时不依赖于插件， - 只有当我们构建打包时才会使用到。）

然后更新您的`src/main.js`文件，以便它从您的package.json导入而不是从`src/foo.js`导入：

```js
// src/main.js
import { version } from '../package.json';

export default function () {
  console.log('version ' + version);
}
```

其次编辑您的`rollup.config.js`文件以包含JSON插件：

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ json() ],
  dest: 'bundle.js'
};
```

最后通过命令`npm run build`来运行Rollup。结果应该是这样子的：

```js
'use strict';

var version = "1.0.0";

var main = function () {
  console.log('version ' + version);
};

module.exports = main;
```

（请注意，只有我们实际需要的数据才会被导入 - `name`和`devDependencies`以及package.json的其他部分是被忽略的。哪是因为[tree-shaking](#what-is-tree-shaking-)在起作用！）

***

> 原文：https://rollupjs.org/#getting-started-with-plugins
