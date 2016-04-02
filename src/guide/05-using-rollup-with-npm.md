---
title: Using Rollup with npm
---

First, we need an file package.json, thereunto run the command

  ``npm init``
  
 which returns the file
  
  ```json
  {
    "name": "name-your-project",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
  }
  ```

Then just install the rollup

  ``npm install --save rollup``

Create your file using of module es2015

  ```js
  //src/main.js
  
  import foo from './foo.js';
  
  export default function () {
    console.log(foo);
  }
  
  ```

and create your module
 
 ```js
 //src/foo.js
 
 export default 42;
 ```

To run, create one script in package.json

```js
"scripts": {
    "build": "rollup src/main.js --output bundle.js"
}
```

and run

  ``npm run build``
  

you now have a compiled module
  
  ```js
  var foo = 42;
  
  function main () {
    console.log(foo);
  }
  
  export default main;
  ```
 
 
 
