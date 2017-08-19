---
title: Frequently Asked Questions
---

### Why are ES modules better than CommonJS modules?

ES modules are an official standard and the clear path forward for JavaScript code structure, whereas CommonJS modules are an idiosyncratic legacy format that served as a stopgap solution before ES modules had been proposed. ES modules allow static analysis that enables optimizations like tree-shaking, and provide advanced features like circular references and live bindings.

### What is "tree-shaking?"

Tree-shaking, also known as "live code inclusion," is the process of only including code that is actually run by a given project. It is [similar to dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n) but can be much more efficient.

### How do I use Rollup with in Node.js with CommonJS modules?

Rollup strives to implement the specification for ES modules, not necessarily the behaviors of Node.js, npm, `require()`, and CommonJS. Consequently, loading of CommonJS modules and using Node's module location resolution logic are both implemented as optional plugins, not included by default in the Rollup core. Just `npm install` the [ComomnJS](https://github.com/rollup/rollup-plugin-commonjs) and [node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) plugins and then enable them using a `rollup.config.js` file and you should be all set.

### Who made the Rollup logo? It's lovely.

I know! It was made by [Julian Lloyd.](https://twitter.com/jlmakes)
