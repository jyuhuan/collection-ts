import { Iterator$flatMap, Iterator$reversed } from './';
import { StringBuilder } from './util/StringBuilder';
import { Iterator, Iterator$map, TSIterator, Iterator$filter, Iterator$concat, Iterator$zipWith } from './Iterator';
import { Ord } from './Ord';

/**
 * The base class for all collections. 
 * 
 * This is an abstract class for all collections that define an 
 * iterator method to step through the collection's elements one by one.
 * 
 * If the size of a collection is immediately ready or efficient to compute, 
 * the implementation of that collection must override `knownSize` to always
 * return true, and provide that efficient size with the `size` function. 
 * 
 * @version 0.0.0
 * @since 0.0.0
 * 
 */
export abstract class Iterable<X> {
  abstract newIterator(): Iterator<X>;

  /**
   * This function returning true ⇒ `this.size()` is very efficient.
   */
  knownSize(): boolean {
    return false;
  }

  /**
   * The number of elements in this iterable. 
   */
  size(): number {
    let i = 0;
    const iter = this.newIterator();
    while (iter.advance()) {
      i += 1;
    }
    return i;
  }

  isEmtpy(): boolean {
    return this.size() == 0;
  }

  reversed(): Iterable<X> {
    return new Iterable$reversed(this);
  }

  //region Operations between Iterables

  concat<Y>(that: Iterable<Y>): Iterable<X|Y> {
    return new Iterable$concat(this, that);
  }

  cartesianProductWith<Y, Z>(that: Iterable<Y>, f: (x: X, y: Y) => Z): Iterable<Z> {
    return this.flatMap(x => that.map(y => f(x, y)));
  }

  cartesianProduct<Y>(that: Iterable<Y>): Iterable<[X, Y]> {
    return this.cartesianProductWith(that, (x, y) => {
      const pair: [X, Y] = [x, y];
      return pair;
    })
  }

  //endregion


  //region HIGHER-ORDER FUNCTIONS

  map<Y>(f: (t: X) => Y): Iterable<Y> {
    return new Iterable$map(this, f);
  }

  flatMap<Y>(f: (x: X) => Iterable<Y>): Iterable<Y> {
    return new Iterable$flatMap(this, f);
  }

  filter(p: (x: X) => boolean): Iterable<X> {
    return new Iterable$filter(this, p);
  }

  reduceLeft(op: (x1: X, x2: X) => X): X {
    throw new Error('An implementation is missing!');
  }
  reduceRight(op: (x1: X, x2: X) => X): X {
    throw new Error('An implementation is missing!');
  }
  reduce(op: (x1: X, x2: X) => X): X {
    return this.reduceLeft(op);
  }

  foldLeft<Y>(y: Y, op: (y: Y, x: X) => Y): Y {
    let res = y;
    for (const x of this) res = op(res, x);
    return res;
  }
  foldRight<Y>(y: Y, op: (x: X, y: Y) => Y): Y {
    return this.reversed().foldLeft(y, (y: Y, x: X) => op(x, y));
  }
  fold(x: X, op: (x1: X, x2: X) => X): X {
    return this.foldLeft(x, op);
  }

  scanLeft<Y>(y: Y, op: (y: Y, x: X) => Y): Iterable<Y> {
    throw new Error('An implementation is missing!');
  }
  scanRight<Y>(y: Y, op: (x: X, y: Y) => Y): Iterable<Y> {
    throw new Error('An implementation is missing!');
  }
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
