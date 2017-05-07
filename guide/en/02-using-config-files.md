---
title: 使用配置文件
---

到目前为止，都进展顺利, 但随着我们添加越来越多的参数，使用命令行去输入这些参数变得越来越是一件麻烦事。


为了避免重复，我们可以创建一个文件包含所有我们需要的参数。这个配置文件是使用 JavaScript 写的，并且被单纯的命令行界面要更灵活。

在项目根目录创建一个名为 `rollup.config.js` 的文件, 同时添加下面的代码：

```js
// rollup.config.js
export default {
  entry: 'src/main.js',
  format: 'cjs',
  dest: 'bundle.js' // 相当于 --output
};
```

为了使用配置文件，我们使用 `--config` or `-c` 标记：

```bash
rm bundle.js # 那我们可以检查命令是否生效！
rollup -c
```

你可以用等价的命令行参数去重写任何在配置文件里的参数：

```bash
rollup -c -o bundle-2.js # --output 等价于 dest
```

(注意 Rollup 自行去处理配置文件，这也是为什么我们可以使用 `export default` 语法 – 代码并没有被 Babel 或其它类似的工具转译, 所以你只可以使用你电脑上运行的 Node.js 版本所支持的那些 ES2015 特性。)

如果你喜欢，你可以指写一个与默认 `rollup.config.js` 不同的配置文件:

```bash
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```

***

> 原文：https://rollupjs.org/#using-config-files