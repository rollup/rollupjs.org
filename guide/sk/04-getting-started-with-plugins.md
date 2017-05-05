---
title: Začíname s rozšíreniami
---

Doposiaľ sme vytvárali iba jednoduché balíčky z prístupového bodu a modulu importovaného z relatívnej cesty. Keď začnete vytvárať komplexnejšie balíčky, často budete potrebovať väčšiu pružnosť — importovanie modulov inštalované cez npm, kompilácia kódu cez Babel, práca so súbormi vo formáte JSON a podobne.

Pre tieto účely používame *rozšírenia*, ktoré zmenia správanie systému v kľučových bodoch procesu tvorby. Zoznam dostupných rozšírení je udržiavaný vo [wiki Rollup](https://github.com/rollup/rollup/wiki/Plugins).

### Používanie rozšírení

Pre tento návod použijeme [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json), čo je rozšírenie, ktoré povoľuje Rollupu importovať dáta zo súboru JSON.

Inštalujte rollup-plugin-json ako závislosť pre vývojové prostredie:

```bash
npm install --save-dev rollup-plugin-json
```

(Používame `--save-dev` namiesto `--save`, pretože náš spustiteľný kód nezávisí od rozšírenia – používa sa iba počas tvorby balíčka.)

Aktualizujte váš súbor `src/main.js` tak, aby importoval súbor package.json namiesto `src/foo.js`:

```js
// src/main.js
import { version } from '../package.json';

export default function () {
  console.log('verzia ' + version);
}
```

Upravte súbor `rollup.config.js` tak, aby zahrnul rozšírenie pre spracovávanie súborov formátu JSON:

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ json() ],
  dest: 'bundle.js'
};
```

Spustite Rollup cez príkaz `npm run build`. Výsledok by mal vyzerať takto:

```js
'use strict';

var version = "1.0.0";

var main = function () {
  console.log('verzia ' + version);
};

module.exports = main;
```

(Všimnite si, že iba dáta, ktoré potrebujeme sú importované - `name` a `devDependencies` a iné časti súbora `package.json` sú ignorované. Presne takto funguje [princíp “trasenia stromov“](#-o-je-princ-p-trasenia-stromov-)!)
