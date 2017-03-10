# Collection.ts

> 🚧 __Ongoing Active Development__  
> See usages in [the Wiki](https://github.com/jyuhuan/collection-ts/wiki/Usage-Highlights). Check out what has been implemented so far and what's to come in [the roadmap](https://github.com/jyuhuan/collection-ts/wiki/Roadmap).

__Collection.js__ is a collection framework providing lazy, efficient, and generic collections for TypeScript. 



Collection.ts exists because of the [Poly-collection](https://github.com/ctongfei/poly-collection) framework on Scala. 🌹


## Features

- Hash map and hash sets (and other keyed/hashed structures) support custom classes, as long as an equivalence strategy (an `Eq<K>` for the key type `K`) and a hashing strategy (a `Hash<K>`) are provided. A related interface, `Ord<K>`, is provided for custom ordering definitions. 
- Almost all higher-order functions (e.g., `map`, `flatMap`, `filter`, `reduce`, ...) are lazy. This means that these transformations only _defines_ (instead of _create_) a new collection. No actual computation will heppen until the elements in the new collection is accessed.
- The higher-order functions return the most specific abstract type possible sa their results. For example, a `map` operation on `ArraySeq` will not return another `ArraySeq` (as in Scala), or `Iterable` (as in C#). It will return `RandomAccessSeq`, which is the most fine-grained abstract class possible for `ArraySeq`s. This is an idea borrowed from [Poly-collection](https://github.com/ctongfei/poly-collection). 
- Easy conversion between Collection.ts collections and TypeScript/JavaScript collections. This allows easy integration with any current project. 
- TypeScript/JavaScript `for of` support. The fact that the `Iterable` class in Collection.ts implements the `Iterable` of JavaScript ensures that a user can operate on Collection.ts structures in the most natural way. 

## Compatibility

Collection.ts is written with TypeScript 2.2.1.

