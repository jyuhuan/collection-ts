import { Iterator$flatMap, Iterator$reversed } from './';
import { StringBuilder } from './util/StringBuilder';
import { Iterator, Iterator$map, TSIterator, Iterator$filter, Iterator$concat, Iterator$zipWith } from './Iterator';
import { Ord } from './strategy/Ord';

/**
 * The base class for all collections. 
 * 
 * This is an abstract class for all collections that define an 
 * iterator method to step through the collection's elements one by one.
 * 
 * If the size of a collection is immediately ready or efficient to compute,
 * the implementation of that collection must override `sizeIsKnown` to always
 * return true, and provide that efficient size with the `size` function. 
 * 
 * The `for of` statement is supported, as the iterator method of 
 * TypeScript/JavaScript is implemented. 
 * 
 * @version 0.0.0
 * @since 0.0.0
 */
export abstract class Iterable<X> {
  abstract newIterator(): Iterator<X>;

  /**
   * This function returning true ⇒ `this.size()` is very efficient.
   */
  sizeIsKnown(): boolean {
    return false;
  }

  /**
   * The number of elements in this iterable.
   *
   * This implementation is ignorant about what the iterable actually is.
   * An implementation of iterable usually has a much more efficient way
   * of computing the size than counting the elements one by one.
   */
  size(): number {
    let i = 0;
    const iter = this.newIterator();
    while (iter.advance()) {
      i += 1;
    }
    return i;
  }

  /**
   * Inspects whether this iterable is empty.
   */
  isEmtpy(): boolean {
    return this.size() == 0;
  }

  /**
   * Reverses the collection.
   */
  reversed(): Iterable<X> {
    return new Iterable$reversed(this);
  }

  head(): X {
    throw new Error('impl');
  }

  tail(): Iterable<X> {
    throw new Error('impl');
  }

  last(): X {
    throw new Error('impl');
  }

  init(): Iterable<X> {
    throw new Error('impl');
  }
  
  //region Operations between Iterables

  concat<Y>(that: Iterable<Y>): Iterable<X|Y> {
    return new Iterable$concat(this, that);
  }

  /**
   * Computes the Cartesian product with this collection and another collection,
   * then transforms the resulting pairs using the provided function.
   *
   * @param that The other collection.
   * @param f The transformational function that operates on a pair resulting from the product.
   */
  cartesianProductWith<Y, Z>(that: Iterable<Y>, f: (x: X, y: Y) => Z): Iterable<Z> {
    return this.flatMap(x => that.map(y => f(x, y)));
  }

  /**
   * Computes the Cartesian product with this collection and another collection.
   * @param that The other collection.
   */
  cartesianProduct<Y>(that: Iterable<Y>): Iterable<[X, Y]> {
    return this.cartesianProductWith(that, (x, y) => {
      const pair: [X, Y] = [x, y];
      return pair;
    })
  }

  //endregion


  //region HIGHER-ORDER FUNCTIONS

  /**
   * Defines a collection in which each element is from this collection, and transformed by the
   * provided function.
   *
   * @param f The transformational function on the elements of this collection.
   *          For each element, this function yields a new element.
   */
  map<Y>(f: (x: X) => Y): Iterable<Y> {
    return new Iterable$map(this, f);
  }

  /**
   * Defines a collection resulted from applying the provided function to each element in this
   * collection, using all the resulted elements.
   *
   * @param f The transformational function on the elements of this collection
   *          For each element, this function yields a new collection of elements.
   */
  flatMap<Y>(f: (x: X) => Iterable<Y>): Iterable<Y> {
    return new Iterable$flatMap(this, f);
  }

  /**
   * Defines a collection resulted from selecting the elements of this collection that makes the
   * provided predicate true.
   *
   * @param p The predicate to be used to test the eligibility of each element in this collection.
   */
  filter(p: (x: X) => boolean): Iterable<X> {
    return new Iterable$filter(this, p);
  }

  /**
   * Reduces the collection to a single value using an operator from left to right.
   * This collection should not be empty.
   *
   * @param op The reducing operator. Should be associative.
   */
  reduceLeft(op: (x1: X, x2: X) => X): X {
    if (this.isEmtpy()) throw new Error('empty.reduce');
    let isFirst = true;
    let res: X = this.head();
    for (const x of this) {
      if (isFirst) isFirst = false;
      else res = op(res, x);
    }
    return res;
  }


  /**
   * Reduces the collection to a single value using an operator from right to left.
   * This collection should not be empty.
   *
   * @param op
   */
  reduceRight(op: (x1: X, x2: X) => X): X {
    return this.reversed().reduceLeft(op);
  }

  /**
   * Reduces the collection to a single value using an associative binary operator.
   * This collection should not be empty.
   *
   * @param op The reducing operator. Should be associative.
   */
  reduce(op: (x1: X, x2: X) => X): X {
    return this.reduceLeft(op);
  }

  /**
   * Folds the elements of this collection using the specified binary operator from left to right.
   *
   * @param x An initial value for the folding operation.
   * @param op A binary operator.
   */
  foldLeft<Y>(y: Y, op: (y: Y, x: X) => Y): Y {
    let res = y;
    for (const x of this) res = op(res, x);
    return res;
  }

  /**
   * Folds the elements of this collection using the specified binary operator from left to right.
   *
   * @typeparam Y The type of the resulting value.
   *
   * @param y An initial value for the folding operation.
   * @param op A binary operator.
   */
  foldRight<Y>(y: Y, op: (x: X, y: Y) => Y): Y {
    return this.reversed().foldLeft(y, (y: Y, x: X) => op(x, y));
  }

  /**
   * Folds the elements of this collection using the specified **associative** binary operator.
   *
   * @param x An initial value for the folding operation.
   * @param op An **associative** binary operator.
   *
   *
   * ```ts
   * // Should return 10
   * ArraySeq.from(1, 2, 3, 4).fold(0, (a, b) => a + b)
   * ```
   */
  fold(x: X, op: (x1: X, x2: X) => X): X {
    return this.foldLeft(x, op);
  }


  scanLeft<Y>(y: Y, op: (y: Y, x: X) => Y): Iterable<Y> {
    throw new Error('An implementation is missing!');
  }
  scanRight<Y>(y: Y, op: (x: X, y: Y) => Y): Iterable<Y> {
    throw new Error('An implementation is missing!');
  }

  /**
   * Performs a prefix scan of the collection.
   *
   * ```ts
   * // Should return a collection consisting of 0, 1, 3, 6, 10
   * ArraySeq.from(1, 2, 3, 4).scan(0, (a, b) => a + b)
   * ```
   */
  scan(x: X, op: (x1: X, x2: X) => X): Iterable<X> {
    return this.scanLeft(x, op);
  }

  zip<Y>(that: Iterable<Y>): Iterable<[X, Y]> {
    return new Iterable$zip(this, that);
  }

  zipWith<Y, Z>(that: Iterable<Y>, f: (x: X, y: Y) => Z) {
    return new Iterable$zipWith(this, that, f);
  }

  min(o: Ord<X>): X {
    return this.reduce(o.min);
  }

  max(o: Ord<X>): X {
    return this.reduce(o.max);
  }

  toArray(): Array<X> {
    const arr = new Array<X>(this.size());
    let i = 0;
    for (const x of this) {
      arr[i] = x;
      i += 1;
    }
    return arr;
  }

  

  //endregion

  makeString(delim: string) {
    let isFirst = true;
    const sb = new StringBuilder();
    for (const element of this) {
      if (isFirst) {
        sb.append(element);
        isFirst = false;
      }
      else {
        sb.append(delim);
        sb.append(element);
      }
    }
    return sb.toString();
  }

  toString(): string {
    return this.makeString('; ');
  }

  /**
   * Conforms to TypeScript iterable to enable `for..of` syntax
   */
  [Symbol.iterator]() {
    return new TSIterator<X>(this.newIterator());
  }
}


class Iterable$reversed<X> extends Iterable<X> {
  iter: Iterable<X>;
  constructor(iter: Iterable<X>) {
    super();
    this.iter = iter;
  }
  newIterator(): Iterator<X> {
    return new Iterator$reversed<X>(this.iter);
  }
}


class Iterable$concat<X, Y> extends Iterable<X|Y> {
  ix: Iterable<X>;
  iy: Iterable<Y>;
  
  constructor(ix: Iterable<X>, iy: Iterable<Y>) {
    super();
    this.ix = ix;
    this.iy = iy;
  }

  newIterator(): Iterator<X|Y> {
    return new Iterator$concat(this.ix.newIterator(), this.iy.newIterator());
  }
}


class Iterable$map<T, U> extends Iterable<U> {
  it: Iterable<T>;
  f: (t: T) => U
  constructor(it: Iterable<T>, f: (t: T) => U) {
    super();
    this.it = it;
    this.f = f;
  }
  newIterator(): Iterator<U> {
    return new Iterator$map(this.it.newIterator(), this.f);
  }
}


class Iterable$flatMap<X, Y> extends Iterable<Y> {
  iter: Iterable<X>;
  f: (x: X) => Iterable<Y>;

  constructor(iter: Iterable<X>, f: (x: X) => Iterable<Y>) {
    super();
    this.iter = iter;
    this.f = f;
  }

  newIterator(): Iterator<Y> {
    return new Iterator$flatMap<X, Y>(this.iter.newIterator(), this.f);
  }
}


class Iterable$filter<X> extends Iterable<X> {
  ix: Iterable<X>;
  p: (x: X) => boolean;
  
  constructor(ix: Iterable<X>, p: (x: X) => boolean) {
    super();
    this.ix = ix;
    this.p = p;
  }

  newIterator(): Iterator<X> {
    return new Iterator$filter(this.ix.newIterator(), this.p);
  }
}

class Iterable$zipWith<X, Y, Z> extends Iterable<Z> {
  ix: Iterable<X>; 
  iy: Iterable<Y>; 
  f: (x: X, y: Y) => Z;
  constructor(ix: Iterable<X>, iy: Iterable<Y>, f: (x: X, y: Y) => Z) {
    super();
    this.ix = ix;
    this.iy = iy;
    this.f = f;
  }
  newIterator(): Iterator<Z> {
    return new Iterator$zipWith(this.ix.newIterator(), this.iy.newIterator(), this.f);
  }
}

class Iterable$zip<X, Y> extends Iterable$zipWith<X, Y, [X, Y]> {
  constructor(ix: Iterable<X>, iy: Iterable<Y>) {
    super(ix, iy, (x, y) => [x, y]);
  }
}
