---
title: Použivanie Rollupu spolu s Babelom
---

Väčšina vývojárov používa [Babel](https://babeljs.io/) pre ich projekty, takže môžu využívať futuristické funckie, ktoré nie sú podporované ani prehliadačmi ani Node.js.

Najľahšiou cestou k používaniu Babelu spolu s Rollup je použitím rozšírenia [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel). Nainštalujte ho pomocou:

```bash
npm i -D rollup-plugin-babel
```

Do `rollup.config.js` napíšte:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'bundle.js'
};
```

Predtým, než Babel začne kompilovať váš kód, Babel musí byť správne nastavený. Vytvorte nový súbor `src/.babelrc`:

```js
{
  "presets": [
    ["latest", {
      "es2015": {
        "modules": false
      }
    }]
  ],
  "plugins": ["external-helpers"]
}
```

Je tam pár neobvyklých vecí v tomto nastavení. Po prvé, musíme nastaviť možnosť `"modules": false`, pretože inak by Babel premenil naše moduly na moduly CommonJS, než sa Rollup dostane k tvorbe a výsledkom bude chyba.

Po druhé, používame rozšírenie `external-helpers`, ktorý povoľuje Rollupu zahŕňať akékoľvek pomocné funkcie iba na vrchu balíčka, namiesto toho, aby sme zahŕňali v každom moduli, ktorý ich bude využívať (čo je predvolené správanie).

Po tretie, súbor `.babelrc` umiestňujeme do priečinka `src`, namiesto toho, aby sme ho umiestnili do koreňa projektu. Vďaka tomu môžeme mať rôzne konfiguračné súbory s názvom `.babelrc` pre iné veci, ako sú testy — dobrým nápadom je, aby sme mali rôzne konfigurácie pre rôzne úlohy.

Predtým, než spustíme Rollup, musíme nainštalovať prednastavený balíček `latest` a rozšírenie `external-helpers`:

```bash
npm i -D babel-preset-latest babel-plugin-external-helpers
```

Spustením Rollup sa vytvorí balíček... aj keď nevyužívame žiadne ES6 funkcie. Upravte súbor `src/main.js`:

```js
// src/main.js
import answer from 'the-answer';

export default () => {
  console.log(`odpoveďou je ${answer}`);
}
```

Spustite Rollup pomocou `npm run build` a pozrite sa na balíček:

```js
'use strict';

var index = 42;

var main = (function () {
  console.log('odpoveďou je ' + index);
});

module.exports = main;
```
