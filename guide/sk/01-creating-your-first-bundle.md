---
title: Vytvárame prvý balíček
---

*Predtým, než začneme sa uistite, že máte nainštalovaný [Node.js](https://nodejs.org), aby sme mohli používať [npm](https://npmjs.com). Taktiež by ste mali vedieť ako manipulovať s [príkazovým riadkom](https://www.codecademy.com/learn/learn-the-command-line) vo vašom stroji.*

Najjednoduchšia cesta k používaniu Rollup je použitím rozhrania príkazového riadku (CLI). Na teraz si Rollup nainštalujeme globálne (neskôr sa naučíme ako ho nainštalovať na jednotlivý projekt, aby sme sa uistili, že celý proces tvorby balíkov je prenosný). Do príkazového riadku napíšte:

```bash
npm install rollup --global # alebo skrátene: `npm i rollup -g`
```

Teraz môžete používať príkaz `rollup`. Skúste to!

```bash
rollup
```

Pretože s príkazom neboli pridané žiadne argumenty, Rollup vypíše inštrukcie použitia. Je to rovanké, ako keby sme spustili `rollup --help` alebo `rollup -h`.

Vytvorme jednoduchý projekt:

```bash
mkdir -p my-rollup-project/src
cd my-rollup-project
```

Najskôr vytvoríme *prístupový bod*. Vložme tento kód do súboru `src/main.js`:

```js
// src/main.js
import foo from './foo.js';
export default function () {
  console.log(foo);
}
```

Potom vytvoríme modul `foo.js`, ktorý bude importovaný prístupovým bodom:

```js
// src/foo.js
export default 'ahoj, svet!';
```

Teraz môžeme vytvoriť balíček:

```bash
rollup src/main.js --format cjs
```

Možnosť `--format` určuje, že aký typ balíčka chceme vytvoriť — v tomto prípade, CommonJS (ktorý sa spúšťa v Node.js). Pretože sme neurčili výstupný súbor, obsah sa vytlačí do `stdout`:

```js
'use strict';

var foo = 'ahoj, svet!';

var main = function () {
  console.log(foo);
};

module.exports = main;
```

Takto môžete uložiť balíček ako súbor:

```bash
rollup src/main.js --format cjs --output bundle.js
# alebo `rollup main.js -f cjs -o bundle.js`
```

(Taktiež môžete použiť `rollup src/main.js > bundle.js`, ale toto je menej flexibílne, keď chceme používať zdrojové mapy.)

Teraz môžeme začať používať kód:

```bash
node
> var myBundle = require('./bundle.js');
> myBundle();
'ahoj, svet!'
```

Blahoželáme! Vytvorili ste svoj prvý balíček pomocou Rollup.
