---
title: ES Module Syntax
---

The following is intended as a lightweight reference for the module behaviors defined in the [ES2015 specification](https://www.ecma-international.org/ecma-262/6.0/), since a proper understanding of the import and export statements are essential to successful use of Rollup.

# Importing

## Named Imports

Import a specific item from a source module, with its original name.

```
import { something } from './module.js';
```

Import a specific item from a source module, with a custom name assigned upon import.

```
import { something as name } from './module.js';
```

## Namespace Imports

Import everything from the source module as an object which exposes all the source module's named exports as properties and methods. Default exports are excluded from this object.

```
import * as module from './module.js'
```

The `something` example from above would then be attached to the imported object as a property, e.g. `module.something`.

## Default Import

Import the **default export** of the source module.

```
import something from './module.js';
```

## Empty Import

Load the module code, but don't make any new objects available.

```
import './module.js';
```

This is useful for polyfills, or when the primary purpose of the imported code is to muck about with prototypes.

# Exporting

Export a value that has been previously declared.

```
var something = true;
export something;
```

Export a value immediately upon declaration.

```
export var something = true;
```

This works with `var`, `let`, `const`, `class`, and `function`. Primitives are always immutable from the perspective of the importing module.

## Named Export

```
export { something };
```

Rename on export.

```
export { something as name };
```

## Default Export

Export a single value as the source module's default export.

```
export default something;
```

This practice is only recommended if your source module only has one export.

It is bad practice to mix default and named exports in the same module, though it is allowed by the specification.

# How Bindings Work

ES modules export *live bindings*, not values, so values can be changed after they are initially imported, and changes made to a value by the importing module at runtime will also propagate back to the source module.

Exported values which are primitives are completely immutable to the importing module.

Exported values which are not primitives can be mutated by the importing module, but not reassigned.
