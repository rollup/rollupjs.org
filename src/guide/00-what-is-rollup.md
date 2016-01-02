---
title: What is Rollup?
---

Rollup is a JavaScript module bundler. It allows you to write your application or library as a set of modules – using modern ES2015 `import`/`export` syntax – and bundle them up into a single file that you can easily include on an HTML page as a `<script>` tag, or distribute via package managers like [npm](https://npmjs.com).


### What are modules, and why should we use them?

A module is just a JavaScript file that is explicit about what it needs in order to run, and what code it makes available to the outside world. Breaking your program apart like this makes it much easier to write good, maintainable code, because you only need to focus on one thing at a time. Suppose you were writing a spellchecker for a web app:

```js
import dictionary from './dictionary.js';
import { extractWords } from './string-utils.js';

export default function spellcheck ( text ) {
  var words = extractWords( text );
  var mistakes = [];

  words.forEach( function ( word ) {
    if ( !dictionary.contains( word.text ) ) {
      mistakes.push({
        start: word.start,
        end: word.end,
        suggestions: dictionary.getSuggestions( word.text )
      });
    }
  });

  /* ... */
}
```

We don't need to worry about the implementation of `extractWords` – how it deals with punctuation and so forth. And we don't need to worry about where `dictionary` gets its data from, or what algorithm it uses to generate suggestions. All we need to worry about is what to do when we find mistakes.

Now imagine writing all the relevant logic in a single file. It would quickly become very large, and very difficult to maintain.

In short, modules help us write code that is

* reusable
* maintainable
* testable
* easier to collaborate on, because Alice and Bob can work on the same app simultaneously (Alice can work on `dictionary` while Bob fixes `extractWords`) without stomping each other's changes
* more bug-resistant, because we don't need to worry about things like naming conflicts between modules

For a while, JavaScripters have been using CommonJS modules and AMD modules as well as various ad hoc formats, but the modern `import`/`export` syntax has a number of [crucial advantages](#why-are-es2015-modules-better-than-amd-and-commonjs-).


### Why do we need to bundle our modules?

For one thing, ES2015 modules don't yet work in browsers or Node.js, so we need to convert them into a usable format. Rollup lets you create AMD modules (for use with tools like [Require.js](http://requirejs.org/)), CommonJS modules (which run in Node.js), self-executing bundles (for inclusion on a page as a `<script>` tag), or Universal Module Definition modules, which work in all environments.

But there are also some major advantages to bundling your code:

* A bundle is more portable and easier to consume than a collection of files
* Compression works better with fewer bigger files than with lots of small ones
* In the browser, a 100kb bundle loads much faster than 5 20kb files (that will change when HTTP/2 gains widespread adoption, but we're not there yet)
* By bundling code, we can take advantage of [tree-shaking](#what-is-tree-shaking-), resulting in fewer wasted bytes
