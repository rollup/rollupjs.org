---
title: Používanie konfiguračných súborov
---

Zatiaľ je všetko v pohode, ale keď začneme používať viac možností, tak písanie rovnakého príkazu začne byť obťažujúce.

Aby sme sa neopakovali, môžeme vytvoriť konfiguračný súbor, ktorý obsahuje všetky možnosti, ktoré potrebujeme. Konfiguračný súbor je písaný v JavaScripte a je flexibilnejší ako nastavenia v príkazoch.

Vytvorte súbor v koreni projektu, ktorý sa bude volať `rollup.config.js` a do neho pridajte tento kód:

```js
// rollup.config.js
export default {
  entry: 'src/main.js',
  format: 'cjs',
  dest: 'bundle.js' // ekvivalent možnosti --output
};
```

Keď chceme použiť konfiguračný súbor, musíme použiť atribút `--config` alebo `-c`:

```bash
rm bundle.js # aby sme sa uistili, či príkaz funguje
rollup -c
```

Niektoré nastavenia viete nahradiť nastaveniami v príkazovom riadku:

```bash
rollup -c -o bundle-2.js # --output je ekvivalentom atribútu dest
```

(Vedzte, že Rollup samo o sebe spracúva konfiguračný súbor, čo je dôvod, prečo môžeme používať syntax `export default` — kód nie je transpilovaný pomocou Babelu alebo niečím podobným, takže môžete používať iba funkcie, ktoré sú podporované vo verzii Node.js, ktorý beží vo vašom stroji.)

Keď chcete, tak môžete určiť iný konfiguračný súbor namiesto predvoleného `rollup.config.js`:

```bash
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```
