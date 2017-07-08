---
title: Big list of options
---

### Required options

* **entry**

    `String` The bundle's entry point (e.g. your `main.js` or `app.js` or `index.js`)

* **format** (CLI: `--format`/`-f`)

    `String` The format of the generated bundle. One of the following:

    * `amd` – Asynchronous Module Definition, used with module loaders like RequireJS
    * `cjs` – CommonJS, suitable for Node and Browserify/Webpack
    * `es` – Keep the bundle as an ES module file
    * `iife` – A self-executing function, suitable for inclusion as a `<script>` tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
    * `umd` – Universal Module Definition, works as `amd`, `cjs` and `iife` all in one

