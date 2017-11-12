---
title: npm run build
---

Veľa JavaScriptových projektov nasleduje obyčajnú konvenciu: spustenie príkazu `npm run build` spustí systém tvorby balíčkov, ktorý sa líši medzi projektami. Tento príkaz je užitočný, pretože keď chce niekto prispievať do kódu, tak sa môže doňho ponoriť bez toho, aby vedel o tom, čo sa používa na vytváranie balíčkov (či je to Rollup, Webpack, Gulp alebo niečo viac esoterické). Rollup v tomto prípade nemusí byť inštalovaný globálne, ako sme to robili v prvej sekcii.

Nastavenie vlastného skriptu pre `npm run build` je príjemné a jednoduché.

### Vytváranie súboru package.json

Súbor package.json obsahuje dôležité informácie o vašom projekte, vrátane názvu, verzie, licencie a závislostí. (V skutočnosti nemôžete zverejniť balíček do npm bez súboru package.json — ale stále by ste ho mali mať, keď vytvárate aplikáciu namiesto knižnice.)

Najľahšiou cestou k vytvoreniu súboru je spustením príkazu `npm init` vo vnútri priečinku projektu a nasledovaním výzviev.

Otvorte súbor package.json a nájdite (alebo vytvorte) sekciu `scripts` a pridajte príkaz `build`:

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

(Predpokladá sa, že v priečinku projektu sa nachádza súbor `rollup.config.js`.)


### Lokálna inštalácia Rollupu

Doteraz sme používali globálnu inštaláciu Rollupu. Je lepšie, keď použijeme *lokálnu* inštaláciu, pretože každý, ktorý si naklonuje váš projekt a spustí `npm install` získa kompatibilnú verziu.

Spustite nasledovný príkaz...

```bash
npm install --save-dev rollup # alebo `npm i -D rollup`
```

...a všimnite si, že sekcia `devDependencies` v súbore package.json obsahuje:

```js
{
  ...,
  "devDependencies": {
    "rollup": "^0.41.4"
  },
  ...
}
```

Všetky skripty, ktoré sa spustia cez `npm run` použijú lokálne inštalované verzie príkazov, ako je `rollup`.

Skúste spustiť príkaz:

```bash
npm run build
```


### Znovu-tvorba balíčkov pri zmene súborov pomocou `npm run dev`

Inštaláciou [rollup-watch](https://github.com/rollup/rollup-watch) si môžete vytvoriť skript, ktorý automaticky vytvorí nový balíček, keď sa zmenia zdrojové súbory:

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

Príkaz `rollup -c -w` (skratka pre `rollup --config --watch`) spustí Rollup v režime sledovania.
