---
title: 大选项列表
---

### 核心功能(Core functionality)

#### 输入(input *`-i`/`--input`*)

`String` 这个包的入口点 (例如：你的 `main.js` 或者 `app.js` 或者 `index.js`)

#### 文件(file *`-o`/`--output.file`*)

`String` 要写入的文件。也可用于生成 sourcemaps，如果适用

#### 格式(format *`-f`/`--output.format`*)

`String` 生成包的格式。 下列之一:

* `amd` – 异步模块定义，用于像RequireJS这样的模块加载器
* `cjs` – CommonJS，适用于 Node 和 Browserify/Webpack
* `esm` – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 `<script type=module>` 标签引入
* `iife` – 一个自动执行的功能，适合作为`<script>`标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
* `umd` – 通用模块定义，以`amd`，`cjs` 和 `iife` 为一体
* `system` - SystemJS 加载器格式

#### 生成包名称(name *`-n`/`--name`*)

`String` 变量名，代表你的 `iife`/`umd` 包，同一页上的其他脚本可以访问它。

```js
// rollup.config.js
export default {
  ...,
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'MyBundle'
  }
};

// -> var MyBundle = (function () {...
```

#### 插件(plugins)

插件对象 `数组 Array` (或一个插件对象) – 有关详细信息请参阅 [插件入门](#getting-started-with-plugins)。记住要调用导入的插件函数(即 `commonjs()`, 而不是 `commonjs`).

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'main.js',
  plugins: [
    resolve(),
    commonjs()
  ]
};
```

#### 外链(external *`-e`/`--external`*)

两者任一 `Function` 需要一个 `id` 并返回 `true`（外部引用）或 `false`（不是外部的引用），
或者 `Array` 应该保留在bundle的外部引用的模块ID。ID应该是：

1. 外部依赖的名称
2. 一个已被找到路径的ID（像文件的绝对路径）

```js
// rollup.config.js
import path from 'path';

export default {
  ...,
  external: [
    'some-externally-required-library',
    path.resolve( './src/some-local-file-that-should-not-be-bundled.js' )
  ]
};
```

当作为命令行参数给出时，它应该是以逗号分隔的ID列表：

```bash
rollup -i src/main.js ... -e foo,bar,baz
```


#### 全局模块(globals *`-g`/`--globals`*)

`Object` 形式的 `id: name` 键值对，用于`umd`/`iife`包。例如：在这样的情况下...

```js
import $ from 'jquery';
```

...我们想告诉 Rollup `jquery` 模块的id等同于 `$` 变量:

```js
// rollup.config.js
export default {
  ...,
  format: 'iife',
  name: 'MyBundle',
  globals: {
    jquery: '$'
  }
};

/*
var MyBundle = (function ($) {
  // 代码到这里
}(window.jQuery));
*/.
```

或者，提供将外部模块ID转换为全局模块的功能。

当作为命令行参数给出时，它应该是一个逗号分隔的“id：name”键值对列表：

```bash
rollup -i src/main.js ... -g jquery:$,underscore:_
```


### 高级功能(Advanced functionality)

#### 路径(paths)

`Function`，它获取一个ID并返回一个路径，或者`id：path`对的`Object`。在提供的位置，这些路径将被用于生成的包而不是模块ID，从而允许您（例如）从CDN加载依赖关系：

```js
// app.js
import { selectAll } from 'd3';
selectAll('p').style('color', 'purple');
// ...

// rollup.config.js
export default {
  input: 'app.js',
  external: ['d3'],
  output: {
    file: 'bundle.js',
    format: 'amd',
    paths: {
      d3: 'https://d3js.org/d3.v4.min'
    }
  }
};

// bundle.js
define(['https://d3js.org/d3.v4.min'], function (d3) {

  d3.selectAll('p').style('color', 'purple');
  // ...

});
```

#### banner/footer

`String` 字符串以 前置/追加 到文件束(bundle)。(注意:“banner”和“footer”选项不会破坏sourcemaps)

```js
// rollup.config.js
export default {
  ...,
  banner: '/* my-library version ' + version + ' */',
  footer: '/* follow me on Twitter! @rich_harris */'
};
```

#### intro/outro

`String`类似于 `banner`和`footer`，除了代码在*内部*任何特定格式的包装器(wrapper)

```js
export default {
  ...,
  intro: 'var ENVIRONMENT = "production";'
};
```

#### 缓存(cache)

`Object` 以前生成的包。使用它来加速后续的构建——Rollup只会重新分析已经更改的模块。

#### onwarn

`Function` 将拦截警告信息。如果没有提供，警告将被复制并打印到控制台。

警告是至少有一个`code` 和 `message`属性的对象，这意味着您可以控制如何处理不同类型的警告：

```js
onwarn (warning) {
  // 跳过某些警告
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

  // 抛出异常
  if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

  // 控制台打印一切警告
  console.warn(warning.message);
}
```

许多警告也有一个`loc`属性和一个`frame`，你可以定位到警告的来源：

```js
onwarn ({ loc, frame, message }) {
  // 打印位置（如果适用）
  if (loc) {
    console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
    if (frame) console.warn(frame);
  } else {
    console.warn(message);
  }
}
```

#### sourcemap *`-m`/`--sourcemap`*

如果 `true`，将创建一个单独的sourcemap文件。如果 `inline`，sourcemap将作为数据URI附加到生成的`output`文件中。

#### sourcemapFile

`String`生成的包的位置。如果这是一个绝对路径，sourcemap中的所有源代码路径都将相对于它。 `map.file`属性是`sourcemapFile`的基本名称(basename)，因为sourcemap的位置被假定为与bundle相邻

如果指定 `output`，`sourcemapFile` 不是必需的，在这种情况下，将通过给bundle输出文件添加 “.map” 后缀来推断输出文件名。

#### interop

`Boolean` 是否添加'interop块'。默认情况下（`interop：true`），为了安全起见，如果需要区分默认和命名导出，则Rollup会将任何外部依赖项“default”导出到一个单独的变量。这通常只适用于您的外部依赖关系（例如与Babel）（如果您确定不需要它），则可以使用“interop：false”来节省几个字节。


### 危险区域(Danger zone)

你可能不需要使用这些选项，除非你知道你在做什么!

#### treeshake

是否应用tree-shaking。建议您省略此选项（默认为`treeshake：true`），除非您发现由tree-shaking算法引起的bug，在这种情况下，请使用“treeshake：false”，一旦您提交了问题！


#### acorn

任何应该传递给Acorn的选项，例如`allowReserved：true`。

#### context

默认情况下，模块的上下文 - 即顶级的`this`的值为`undefined`。在极少数情况下，您可能需要将其更改为其他内容，如 `'window'`。

#### moduleContext

和`options.context`一样，但是每个模块可以是`id: context`对的对象，也可以是`id => context`函数。

#### legacy

为了增加对诸如IE8之类的旧版环境的支持，通过剥离更多可能无法正常工作的现代化的代码，其代价是偏离ES6模块环境所需的精确规范。

#### exports

`String` 使用什么导出模式。默认为`auto`，它根据`entry`模块导出的内容猜测你的意图：

* `default` – 如果你使用 `export default ...` 仅仅导出一个东西，那适合用这个
* `named` – 如果你导出多个东西，适合用这个
* `none` – 如果你不导出任何内容 (例如，你正在构建应用程序，而不是库)，则适合用这个

`default` 和 `named`之间的区别会影响其他人如何使用文件束(bundle)。如果您使用`default`，则CommonJS用户可以执行此操作，例如

```js
var yourLib = require( 'your-lib' );
```

使用 `named`，用户可以这样做：

```js
var yourMethod = require( 'your-lib' ).yourMethod;
```

有点波折就是如果你使用`named`导出，但是*同时也*有一个`default`导出，用户必须这样做才能使用默认的导出：

```js
var yourMethod = require( 'your-lib' ).yourMethod;
var yourLib = require( 'your-lib' )['default'];
```

#### amd *`--amd.id` and `--amd.define`*

`Object` 可以包含以下属性：

**amd.id** `String` 用于 AMD/UMD 软件包的ID：

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    id: 'my-bundle'
  }
};

// -> define('my-bundle', ['dependency'], ...
```

**amd.define** `String` 要使用的函数名称，而不是 `define`:

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    define: 'def'
  }
};

// -> def(['dependency'],...
```

#### indent

`String` 是要使用的缩进字符串，对于需要缩进代码的格式（`amd`，`iife`，`umd`）。也可以是`false`（无缩进）或`true`（默认 - 自动缩进）

```js
// rollup.config.js
export default {
  ...,
  indent: false
};
```

#### strict

`true`或`false`（默认为`true`） - 是否在生成的非ES6软件包的顶部包含'use strict'pragma。严格来说（geddit？），ES6模块*始终都是*严格模式，所以你应该没有很好的理由来禁用它。

### Watch options

这些选项仅在运行 Rollup 时使用 `--watch` 标志或使用 `rollup.watch` 时生效。

#### watch.chokidar

一个 `Boolean` 值表示应该使用 [chokidar](https://github.com/paulmillr/chokidar) 而不是内置的 `fs.watch`，或者是一个传递给 chokidar 的选项对象。

如果你希望使用它，你必须单独安装chokidar。


#### watch.include

限制文件监控至某些文件：

```js
// rollup.config.js
export default {
  ...,
  watch: {
    include: 'src/**'
  }
};
```


#### watch.exclude

防止文件被监控：

```js
// rollup.config.js
export default {
  ...,
  watch: {
    exclude: 'node_modules/**'
  }
};
```
