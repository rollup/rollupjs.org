---
title: npm run build
---

Lots of JavaScript projects follow a simple convention: typing `npm run build` executes whatever build system the project uses. This is helpful because it means that someone who wants to help contribute to your project can dive right into the source code without knowing anything about the plumbing that ties it together (be that Rollup, or Webpack, or Gulp, or something more esoteric). They don't even need to install it globally like we did in the first section.

Setting up your own `npm run build` script is nice and straightforward.

### Creating a package.json file

A package.json file contains important information about your project, including its name, version, license and dependencies. (In fact, you can't publish a package to npm without a package.json — but you should still have one if you're building an application rather than a library.)

The easiest way to create one is by running `npm init` inside the project folder and following the prompts.

Open the package.json and find (or create) the `scripts` section, and add a `build` entry:

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

(This assumes you've got a `rollup.config.js` file in your project folder.)


### Installing Rollup locally

Up till now we've been using a global installation of Rollup. It's much better to use a *local* installation, because then anyone cloning your project and running `npm install` will get a compatible version.

Run the following command...

```bash
npm install --save-dev rollup # or `npm i -D rollup`
```

...and notice that a `devDependencies` section has been added to your package.json:

```js
{
  ...,
  "devDependencies": {
    "rollup": "^0.41.4"
  },
  ...
}
```

All of your `npm run` scripts will look for locally installed versions of commands like `rollup` if they exist.

Try running the script:

```bash
npm run build
```


### Rebuilding when files change with `npm run dev`

By installing [rollup-watch](https://github.com/rollup/rollup-watch), you can create a script that automatically rebuilds your bundle whenever its source files change:

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

The command `rollup -c -w` (short for `rollup --config --watch`) runs Rollup in watch mode.