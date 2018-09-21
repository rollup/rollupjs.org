---
title: Troubleshooting
---

If you get stuck, please try discussing the issue on [the Rollup Gitter](https://gitter.im/rollup/rollup) or posting a question to https://stackoverflow.com/questions/tagged/rollupjs. If you've found a bug, or Rollup can't meet your needs, please try [raising an issue](https://github.com/rollup/rollup/issues). Lastly, you may try contacting [@RollupJS](http://twitter.com/RollupJS) on Twitter.

### Avoiding `eval`

You probably already know that '`eval` is evil', at least according to some people. But it's particularly harmful with Rollup, because of how it works – unlike other module bundlers, which wrap each module in a function, Rollup puts all your code in the same scope.

That's more efficient, but it means that the shared scope is 'polluted' whenever you use `eval`, whereas with a different bundler, modules that *didn't* use eval would not be polluted. A minifier can't mangle variable names in polluted code, because it can't guarantee that the code to be evaluated doesn't reference those variable names.

Furthermore, **it poses a security risk** in that a malicious module could access another module's private variables with `eval('SUPER_SEKRIT')`.

Luckily, unless you *really do* intend for the evaluated code to have access to local variables (in which case you're probably doing something wrong!), you can achieve the same effect in one of two ways:

#### eval2 = eval

Simply 'copying' `eval` provides you with a function that does exactly the same thing, but which runs in the global scope rather than the local one:

```js
var eval2 = eval;

(function () {
  var foo = 42;
  eval('console.log("with eval:",foo)');  // logs 'with eval: 42'
  eval2('console.log("with eval2:",foo)'); // throws ReferenceError
})();
```

#### `new Function`

Using the [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) generates a function from the supplied string. Again, it runs in the global scope. If you need to call the function repeatedly, this is much, *much* faster than using `eval`.


### Tree-shaking Doesn't Seem to be Working

Sometimes, you'll end up with code in your bundle that doesn't seem like it should be there. For example, if you import a utility from `lodash-es`, you might expect that you'll get the bare minimum of code necessary for that utility to work.

But Rollup has to be conservative about what code it removes in order to guarantee that the end result will run correctly. If an imported module appears to have *side-effects*, either on bits of the module that you're using or on the global environment, Rollup plays it safe and includes those side-effects.

Because static analysis in a dynamic language like JavaScript is hard, there will occasionally be false positives. Lodash is a good example of a module that *looks* like it has lots of side-effects, even in places that it doesn't. You can often mitigate those false positives by importing submodules (e.g. `import map from 'lodash-es/map'` rather than `import { map } from 'lodash-es'`).

Rollup's static analysis will improve over time, but it will never be perfect in all cases – that's just JavaScript.


### Error: "[name] is not exported by [module]"

Occasionally you will see an error message like this:

> 'foo' is not exported by bar.js (imported by baz.js)

Import declarations must have corresponding export declarations in the imported module. For example, if you have `import a from './a.js'` in a module, and a.js doesn't have an `export default` declaration, or `import {foo} from './b.js'`, and b.js doesn't export `foo`, Rollup cannot bundle the code.

This error frequently occurs with CommonJS modules converted by [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs), which makes a reasonable attempt to generate named exports from the CommonJS code but won't always succeed, because the freewheeling nature of CommonJS is at odds with the rigorous approach we benefit from in JavaScript modules. It can be solved by using the [namedExports](https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports) option, which allows you to manually fill in the information gaps.


### Error: "this is undefined"

In a JavaScript module, `this` is `undefined` at the top level (i.e., outside functions). Because of that, Rollup will rewrite any `this` references to `undefined` so that the resulting behaviour matches what will happen when modules are natively supported.

There are occasional valid reasons for `this` to mean something else. If you're getting errors in your bundle, you can use `options.context` and `options.moduleContext` to change this behaviour.


### Warning: "Ambiguous default export"

This warning is given when Rollup encounters a default export that *looks* like a function declaration, but is in fact parsed as a call expression:

```js
export default function foo () {
  // this looks like a function declaration, but it isn't!
}

(function iife () {
  // `foo` is immediately invoked because the parentheses
  // around this block turn it into a function expression
}())
```

If you want to export the function declaration, separate the declaration from the export:

```js
function foo () {
  // ...
}

export default foo;
```

If you want to export the call expression but suppress the warning, wrap the function expression in parentheses to eliminate the ambiguity:

```js
export default (function foo () {
  // ...
})

(function iife () {
  // ...
}())
```


### Warning: "Sourcemap is likely to be incorrect"

You'll see this warning if you generate a sourcemap with your bundle (`sourceMap: true` or `sourceMap: 'inline'`) but you're using one or more plugins that transformed code without generating a sourcemap for the transformation.

Usually, a plugin will only omit the sourcemap if it (the plugin, not the bundle) was configured with `sourceMap: false` – so all you need to do is change that. If the plugin doesn't generate a sourcemap, consider raising an issue with the plugin author.


### Warning: "Treating [module] as external dependency"

Rollup will only resolve *relative* module IDs by default. This means that an import statement like this...

```js
import moment from 'moment';
```

...won't result in `moment` being included in your bundle – instead, it will be an external dependency that is required at runtime. If that's what you want, you can suppress this warning with the `external` option, which makes your intentions explicit:

```js
// rollup.config.js
export default {
  entry: 'src/index.js',
  dest: 'bundle.js',
  format: 'cjs',
  external: [ 'moment' ] // <-- suppresses the warning
};
```

If you *do* want to include the module in your bundle, you need to tell Rollup how to find it. In most cases, this is a question of using [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve).

Some modules, like `events` or `util`, are built in to Node.js. If you want to include those (for example, so that your bundle runs in the browser), you may need to include [rollup-plugin-node-builtins](https://github.com/calvinmetcalf/rollup-plugin-node-builtins).
