---
title: Frequently Asked Questions
---

### Why are ES modules better than CommonJS modules?

ES modules are an official standard and the clear path forward for JavaScript code structure, whereas CommonJS modules are an idiosyncratic legacy format that served as a stopgap solution before ES modules had been proposed. ES modules allow static analysis that enables optimizations like tree-shaking, and provide advanced features like circular references and live bindings.

### What is "tree-shaking?"

Tree-shaking, also known as "live code inclusion," is the process of only including code that is actually run by a given project. It is [similar to dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n) but can be much more efficient.

### How do I use Rollup with in Node.js with CommonJS modules?

Rollup strives to implement the specification for ES modules, not necessarily the behaviors of Node.js, npm, `require()`, and CommonJS. Consequently, loading of CommonJS modules and using Node's module location resolution logic are both implemented as optional plugins, not included by default in the Rollup core. Just `npm install` the [ComomnJS](https://github.com/rollup/rollup-plugin-commonjs) and [node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) plugins and then enable them using a `rollup.config.js` file and you should be all set.

### Is Rollup meant for building libraries or applications?

Rollup is already used by many major JavaScript libraries, and can also be used to build the vast majority of applications. However, Rollup doesn't yet support a few specific advanced features that can sometimes be useful when building applications, most notably code splitting and [dynamic imports at runtime](https://github.com/tc39/proposal-dynamic-import). If your project needs either of those, you may be better off with [Webpack](https://webpack.js.org/).

### Who made the Rollup logo? It's lovely.

[Julian Lloyd](https://twitter.com/jlmakes)!
