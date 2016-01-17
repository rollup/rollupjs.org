---
title: Creating your first bundle
---

*Before we begin, you'll need to have [Node.js](https://nodejs.org) installed so that you can use [npm](https://npmjs.com). You'll also need to know how to access the [command line](https://www.codecademy.com/learn/learn-the-command-line) on your machine.*

The easiest way to use Rollup is via the Command Line Interface (or CLI). For now, we'll install it globally (later on we'll learn how to install it locally to your project so that your build process is portable, but don't worry about that yet). Type this into the command line:

```bash
npm install rollup --global # or `npm i rollup -g` for short
```

You can now run the `rollup` command. Try it!

```bash
rollup
```

Because no arguments were passed, Rollup prints usage instructions. This is the same as running `rollup --help`, or `rollup -h`.

Let's create a simple project:

```bash
mkdir -p my-rollup-project/src
cd my-rollup-project
```

First, we need an *entry point*:

```bash
cat <<EOS > src/main.js
import foo from './foo.js';
export default function () {
  console.log(foo);
}
EOS
```

Then, let's create the `foo.js` module that our entry point imports:

```bash
echo "export default 42;" > src/foo.js
```

Now we're ready to create a bundle:

```bash
rollup src/main.js
```

This will print the bundle straight to `stdout`:

```js
var foo = 42;

function main () {
  console.log(foo);
}

export default main;
```

You can save the bundle as a file like so:

```bash
rollup src/main.js --output bundle.js # or rollup main.js -o bundle.js
```

(You could also do `rollup src/main.js > bundle.js`, but as we'll see later, this is less flexible if you're generating sourcemaps.)

Of course, this code won't actually *run*, because it's still an ES2015 module with an `export` statement. So let's create a CommonJS module, which will run in Node.js:

```bash
rollup src/main.js --output bundle.js --format cjs
# or rollup src/main.js -o bundle.js -f cjs
```

This creates the following bundle – anything exported from the entry module (in this case, a function that logs the answer to life, the universe and everything) becomes part of the bundle's exports:

```js
'use strict';

var foo = 42;

function main () {
  console.log(foo);
}

module.exports = main;
```

Try running the code:

```bash
node
> var myBundle = require('./bundle.js');
> myBundle();
42
```

Congratulations! You've created your first bundle with Rollup.
