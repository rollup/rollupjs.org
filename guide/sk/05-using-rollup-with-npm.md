---
title: Používanie Rollup spolu s balíčkami z npm
---

V určitom okamihu je pravdepodobné, že váš projekt bude závislý na balíčkoch z repozitára npm vo vašom priečinku `node_modules`. Na rozdiel od iných zväzovačov ako sú Webpack alebo Browserify, Rollup nevie samo od seba pracovať so závislosťami — musíme to nastaviť.

Skúsme pridať jednoduchú závislosť nazvanú [the-answer](https://www.npmjs.com/package/the-answer), ktorá exportuje odpoveď na otázku života, vesmíru a všetkého možného:

```bash
npm install --save the-answer # alebo `npm i -S the-answer`
```

Všimnite si, že teraz používame `--save`, takže balíček bude uložený v sekcii `dependencies` súbora package.json.

Keď upravíme súbor `src/main.js`...

```js
// src/main.js
import answer from 'the-answer';

export default function () {
  console.log('odpoveďou je ' + answer);
}
```

...a spustíme Rollup...

```bash
npm run build
```

...uvidíme upozornenie podobné tomuto:

```
⚠️ 'the-answer' is imported by src/main.js, but could not be resolved – treating it as an external dependency
```

Výsledný `bundle.js` bude fungovať v Node.js, pretože príkaz `import` sa premení na príkaz v CommonJS `require`, ale balíček `the-answer` sa *nezahrnie* do balíčka. Na to potrebujeme rozšírenie.

### rollup-plugin-node-resolve

Rozšírenie [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) naučí Rollup ako pracovať s externými modulmi. Nainštalujte ho...

```bash
npm install --save-dev rollup-plugin-node-resolve
```

...a pridajte ho do konfiguračného súboru:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ resolve() ],
  dest: 'bundle.js'
};
```

Teraz, keď spustíte `npm run build`, nevypíše sa žiadne upozornenie — balíček bude obsahovať importovaný modul.


### rollup-plugin-commonjs

Niektoré knižnice vystavujú ES6 moduly, ktoré môžete importovať tak, ako sú — `the-answer` je jedným z nich. V súčasnosti, väcšina balíčkov v npm sú namiesto toho vystavení modulom CommonJS. Pokiaľ sa to nezmení, musíme premeniť moduly z CommonJS na ES6, aby ich Rollup vedel spracovať.

Rozšírenie [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) robí presne to isté.

Buďte si vedomí, že `rollup-plugin-commonjs` má byť *pred* ostatnými rozšíreniami, ktoré transformujú vaše moduly — to je preto, aby sa predišlo ostatným rozšíreniam, aby vykonávali zmeny, ktoré môžu prerušiť detekciu modulov CommonJS.

## Zdieľané závislosti

Povedzme, že vytvárate knižnicu, ktorá ma zdieľanú závislosť ako je React alebo Lodash. Ak nastavíte všetky externé balíčky tak, ako je vysvetlené vyššie, Rollup zabalí do balíčka *všetky* importy:

```js
import answer from 'the-answer';
import _ from 'lodash';
```

Taktiež môžete nastaviť, že ktoré importy budú zabalené a ktoré importy budete považovať ako externé. Na tomto príklade budeme považovať `lodash` ako externý, ale nie `the-answer`.

Tu je konfiguračný súbor:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [resolve({
    // nastavenia k rozšíreniu resolve
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // toto indikuje, ktoré moduly budu považované za externé
  external: ['lodash'],
  dest: 'bundle.js'
};
```

A hotovo, `lodash` bude teraz považovaný za externý modul a nebudé zahrnutý vo vašej knižnici.

Atribút `external` akceptuje buď pole s názvami modulov alebo funkciu s názvom modulu, ktorý vráti pravdivú hodnotu, ak má byť modul považovaný za externý. Napríklad:

```js
export default {
  // ...
  external: id => /lodash/.test(id)
}
```

Taktiež môžete použiť tento tvar importovania modulov, ak používate [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) pre importovanie určitých modulov. V tomto prípade, Babel premení váš príkaz importovania na niečo podobné, ako je toto:

```js
import _merge from 'lodash/merge';
```

Ak použivate pole pre atribút `external`, tak pole nevyužíva zástupné znaky, takže tento import bude považovaný za externý iba keď kondícia bude napísaná ako funkcia.
