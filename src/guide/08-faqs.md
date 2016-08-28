---
title: Frequently asked questions
---

### What is 'tree-shaking'?

Tree-shaking a.k.a. Live code inclusion is the process of only including the code that is used.  It has a similar affet as dead code elimination but is slightly more effecient.
Read more about the origin of the name: (Tree-shaking vs Dead-Code Elimination)[https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n]

### Why are ES2015 modules better than AMD and CommonJS?

ES2015 modules allow static anlysis that enables tree-shaking / optimization mentioned above.  They also work across both node and the browse and support circular references. 
