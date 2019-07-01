---
title: ES模块语法
---

以下内容旨在对[ES2015规范](https://www.ecma-international.org/ecma-262/6.0/)中定义的模块行为做一个轻量级的参考，因为对导入和导出语句的正确理解对于成功使用Rollup是至关重要的。

### 导入(Importing)

导入的值不能重新分配，尽管导入的对象和数组可以被修改（导出模块，以及任何其他的导入，都将受到该修改的影响）。在这种情况下，它们的行为与const声明类似。


#### 命名导入(Named Imports)

从源模块导入其原始名称的特定项目。

```js
import { something } from './module.js';
```

从源模块导入特定项，并在导入时指定自定义名称。

```js
import { something as somethingElse } from './module.js';
```

#### 命名空间导入(Namespace Imports)

将源模块中的所有内容作为对象导入，将所有源模块的命名导出公开为属性和方法。默认导出被排除在此对象之外。

```js
import * as module from './module.js'
```

上面的“something”的例子将被附加到作为属性的导入对象上。“module.something”。

#### 默认导入(Default Import)

导入源文件的**默认导出**

```js
import something from './module.js';
```

#### 空的导入(Empty Import)

加载模块代码，但不要创建任何新对象。

```js
import './module.js';
```

这对于polyfills是有用的，或者当导入的代码的主要目的是与原型有关的时候。


### 导出(Exporting)

#### 命名导出(Named exports)

导出以前声明的值：

```js
var something = true;
export { something };
```

在导出时重命名：

```js
export { something as somethingElse };
```

声明后立即导出：

```js
// 这可以与 `var`, `let`, `const`, `class`, and `function` 配合使用
export var something = true;
```


#### 默认导出(Default Export)

导出一个值作为源模块的默认导出：

```js
export default something;
```

仅当源模块只有一个导出时，才建议使用此做法。

将默认和命名导出组合在同一模块中是不好的做法，尽管它是规范允许的。


### 绑定是如何工作的(How bindings work)

ES模块导出*实时绑定*，而不是值，所以值可以在最初根据[这个示例](https://rollupjs.org/repl/?shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMGNvdW50JTJDJTIwaW5jcmVtZW50JTIwJTdEJTIwZnJvbSUyMCcuJTJGaW5jcmVtZW50ZXIuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhjb3VudCklM0IlNUNuaW5jcmVtZW50KCklM0IlNUNuY29uc29sZS5sb2coY291bnQpJTNCJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMmluY3JlbWVudGVyLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmV4cG9ydCUyMGxldCUyMGNvdW50JTIwJTNEJTIwMCUzQiU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBpbmNyZW1lbnQoKSUyMCU3QiU1Q24lNUN0Y291bnQlMjAlMkIlM0QlMjAxJTNCJTVDbiU3RCUyMiU3RCU1RCUyQyUyMm9wdGlvbnMlMjIlM0ElN0IlMjJmb3JtYXQlMjIlM0ElMjJjanMlMjIlMkMlMjJnbG9iYWxzJTIyJTNBJTdCJTdEJTJDJTIybW9kdWxlSWQlMjIlM0ElMjIlMjIlMkMlMjJuYW1lJTIyJTNBJTIybXlCdW5kbGUlMjIlN0QlMkMlMjJleGFtcGxlJTIyJTNBbnVsbCU3RA==)导入后更改：

```js
// incrementer.js
export let count = 0;

export function increment() {
  count += 1;
}
```

```js
// main.js
import { count, increment } from './incrementer.js';

console.log(count); // 0
increment();
console.log(count); // 1

count += 1; // Error — 只有 incrementer.js 可以改变这个值。
```
