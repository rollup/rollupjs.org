---
title: npm run build
---

许多 JavaScript 项目都遵循一个简单的约定：输入 `npm run build` 执行任何项目使用的构建系统。这点非常有用是因为它意味着有人想帮着贡献你的项目，他可以直接投身进源码中，而不需要知晓任何与之绑定的基础设施(像Rollup, 或 Webpack, 或 Gulp, 或一些更为难懂的)。他们甚至不需要全局安装它，正如我们在第一部份所做的一样。

设置你自己的 `npm run build` 脚本是非常好并且是直截了当的。

### 创建立一个 package.json 文件

一个 package.json 包含关于你项目的重要信息，包括它的名称、版本、许可证和依赖。(实际上，你不可以发布一个不包括 package.json 的程序包 - 但你仍然应该有一个这样的文件如果你构建的是一个应用而非一个库)。

最容易的方式去创建一个项目是在项文件夹里去执行 `npm init` 及跟着提示去做。

打开 package.json 并找到(创建) `scripts` 部份, 添加 `build` 键值:

```js
{
  ...,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rollup -c"
  },
  ...
}
```

(这里假设你已经有一个 `rollup.config.js` 文件在项目文件夹里了)。


### 本地安装Rollup

直到现在，我们已经使用了全局安装的 Rollup. 但使用 *本地* 安装的会更好，因为这样任何人克隆你的项目和运行 `npm install` 将会得到一个兼容的版本。

执行以下的命令...

```bash
npm install --save-dev rollup # or `npm i -D rollup`
```

...你会留意到 `devDependencies` 部份被添加到你项目的 package.json 文件中:

```js
{
  ...,
  "devDependencies": {
    "rollup": "^0.41.4"
  },
  ...
}
```

你所有的 `npm run` 脚本都将会寻找本地安装的命令，如 `rollup` 若它们存在的话。

尝试运行脚本：

```bash
npm run build
```


### 当文件更新，用`npm run dev` 重新构建

通过安装 [rollup-watch](https://github.com/rollup/rollup-watch), 你可以创建一个脚本，当它的源文件改变的时候，它会自动重新构建：

```bash
npm install --save-dev rollup-watch
```

```js
{
  ...,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rollup -c",
    "dev": "rollup -c -w"
  },
  ...
}
```

命令 `rollup -c -w` (是 `rollup --config --watch` 的简写) 让 Rollup 在监视模式下运行。

***

> 原文：https://rollupjs.org/#npm-run-build