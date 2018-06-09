---
title: Predstavenie
---

### Prehľad

Rollup je zväzovač modulov pre JavaScript, ktorý kompiluje malé časti kódu na niečo väčšie a komplexnejšie, ako je knižnica alebo aplikácia. Používa nový štandardizovaný formát pre moduly zahrnuté v revízii ECMAScript 6, namiesto idiosynkrétnych riešení ako je CommonJS a AMD. Moduly v ES6 vám umožňujú voľne a hladko kombinovať naužitočnejšie funkcie z vašich obľubených knižníc. V budúcnosti bude možné natívne využívať moduly, ale Rollup to dokáže už dnes.

### Návod na rýchly štart

Inštalujte pomocou `npm install --global rollup`. Rollup sa dá používať pomocou [rozhrania príkazového riadku](https://github.com/rollup/rollup/wiki/Command-Line-Interface) s voliteľným súborom nastavení alebo pomocou [JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API). Spustite `rollup --help` pre zoznam možných nastavení. [Šablóna na štartovací projekt](https://github.com/rollup/rollup-starter-project) ukazuje bežné nastavenia. Detailnejšie pokyny sú dostupné v [príručke pre používateľa](http://rollupjs.org/).

#### Príkazy

Tieto príkazy predpokladajú, že prístupový bod do aplikácie sa nazýva main.js a že chcete všetky tieto importované súbory kompilovať do súboru nazvaný bundle.js.

Pre prehliadače:

```bash
# kompilovať pre využitie v <script> ako samo-spúšťaciu funkciu
$ rollup main.js --file bundle.js --format iife
```

Pre Node.js:

```bash
# kompilovať ako CommonJS modul
$ rollup main.js --file bundle.js --format cjs
```

Pre prehliadače a Node.js:

```bash
# formát UMD vyžaduje názov balíčka
$ rollup main.js --file bundle.js --format umd --name "myBundle"
```

### Prečo

Vývoj softvéru je v mnohých prípadoch jednoduchší, keď rozdelíte projekt na niekoľko malých častí, ktoré často odstraňujú neočakavané interakcie a dramaticky znižujú komplexitu problémov k vyriešeniu, a písanie malých projektov [nie je riešením problému](https://medium.com/@Rich_Harris/small-modules-it-s-not-quite-that-simple-3ca532d65de4). Bohužiaľ, JavaScript neobsahuje túto vymoženosť v jadre jazyka.

Toto sa nakoniec zmenilo v revízii ECMAScript 6, ktorý obsahuje syntax pre importovanie a exportovanie funkcií a dát, takže môžu byť zdieľané medzi niekoľkými skriptami. Špecifikácia je teraz opravená, ale ešte nie je implementovaná v prehliadačoch a Node.js. Rollup umožňuje písanie kódu pomocou nového systému modulov a zkompiluje ich do existujúcich formátov ako sú moduly CommonJS, AMD, alebo skripty štýlu IIFE. To znamená, že môžete písať *kód budúcnosti* a využiť výhody princípu “trepania stromov”.

### Princíp “trepania stromov”

Použitím ES6 modulov Rollup navyše staticky analyzuje kód, ktorý importujete a vylúči kód, ktorý sa vôbec nepoužíva. Vďaka tomu viete vytvárať súbory na základe existujúcich nástrojov a modulov bez pridávania ďalších závislostí alebo zvyšovania veľkosti projektu.

Napríklad, cez CommonJS *sa musí importovať celá knižnica*.

```js
// importovať celý projekt utils cez CommonJS
var utils = require( 'utils' );
var query = 'Rollup';
// použiť metódu ajax z projektu utils
utils.ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

Ale keď použijete ES6 moduly, tak namiesto importovania celého projektu `utils` môžete importovať iba jednu funkciu, `ajax`, ktorú potrebujete:

```js
// importovať ajax funkciu cez ES6 príkaz import
import { ajax } from 'utils';
var query = 'Rollup';
// privolať funkciu ajax
ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

Pretože Rollup obsahuje iba prosté minimum, výsledkom sú ľahšie, rýchlejšie a menej komplikované knižnice a aplikácie. Pretože tento prístup je založený na zreteľných príkazoch `import` a `export`, je efektívnejšie spustiť automatizovaný minifier k zisteniu nepoužitých premenných vo výslednom kóde.

### Kompatibilita

#### Importovanie modulov CommonJS

Rollup vie importovať existujúce moduly CommonJS [pomocou rozšírenia](https://github.com/rollup/rollup-plugin-commonjs).

#### Zverejňovanie ES6 modulov

Aby sme si boli istí, že vaše ES6 moduly môžu byť použiteľné nástrojmi, ktoré pracujú spolu s CommonJS ako je Node.js alebo webpack, môžete použiť Rollup tak, aby ste kompilovali do formátu UMD alebo CommonJS, a poukázať na skompilovaný súbor pomocou atribútu `main` v súbore `package.json`. Ak váš súbor `package.json` obsahuje atribút `module`, tak nástroje, ktoré pracujú s ES6 modulmi ako je Rollup a [webpack 2](https://webpack.js.org) budú napriamo [používať verziu s podporou pre ES6 moduly](https://github.com/rollup/rollup/wiki/pkg.module).

### Pozrite aj

- [séria krok-za-krokom video návodov](https://code.lengstorf.com/learn-rollup-js/), spolu s písanou sprevádzajúcou príručkou
- rôzne problémy a ich riešenia vo [wiki](https://github.com/rollup/rollup/wiki)

