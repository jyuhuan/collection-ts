import { Iterable } from './Iterable';

/**
 * An iterator is a data structure that iterates over the elements of some collection. 
 * 
 * 
 * The two methods in this interface are:
 *  - `current`, which returns the current element that is pointed to by the iterator.
 *  - `advance`, which moves the iterator to the next element.
 * 
 * `current` should always return the same object until `advance` is called. 
 * 
 * When an iterator is newly created, its position should be immediated before the 
 * first element in the collection. At this position, `current` should be undefined. 
 * The eventual position of the iterator is immediated after the last element in the
 * collection, and `advance` should return false. If the last call to `advance` 
 * returns false, then `current` should be undefined. The iterator is considered dead
 * at this point. A new iterator should be created anew in case the collection is to
 * be iterated again. 
 * 
 * @version 0.0.0
 * @since 0.0.0 
 */
export interface Iterator<T> {
  current(): T;
  advance(): boolean;
}


export class Iterator$reversed<X> implements Iterator<X> {
  arr: Array<X>;
  i: number;
  constructor(iter: Iterable<X>) {
    this.arr = iter.toArray();
    this.i = this.arr.length;
  }
  current(): X {
    return this.arr[this.i];
  }
  advance(): boolean {
    this.i -= 1;
    return this.i >= 0;
  }
}

export class Iterator$concat<X, Y> implements Iterator<X|Y> {
  iter1: Iterator<X>; 
  iter2: Iterator<Y>;
  curIter: Iterator<X|Y>;
  isFirst: boolean;

  constructor(iter1: Iterator<X>, iter2: Iterator<Y>) {
    this.iter1 = iter1;
    this.iter2 = iter2;
    this.curIter = iter1;
    this.isFirst = true;
  }

  current(): X|Y {
    return this.curIter.current();
  }
  advance(): boolean {
    if (this.curIter.advance()) return true;
    else if (this.isFirst) {
      this.isFirst = false;
      this.curIter = this.iter2;
      return this.curIter.advance();
    }
    else return false;
  }
}


export class Iterator$flatMap<X, Y> implements Iterator<Y> {
  outer: Iterator<X>;
  inner: Iterator<Y>;
  f: (x: X) => Iterable<Y>;
  constructor(iter: Iterator<X>, f: (x: X) => Iterable<Y>) {
    this.f = f;
    this.outer = iter;
    this.inner = EmptyIterator;
  }
  current(): Y {
    return this.inner.current();
  }
  advance(): boolean {
    if (this.inner.advance()) return true;
    else {
      while (this.outer.advance()) {
        this.inner = this.f(this.outer.current()).newIterator();
        if (this.inner.advance()) return true;
      }
      return false;
    }
  }
}


export class Iterator$map<T, U> implements Iterator<U> {
  it: Iterator<T>;
  f: (t: T) => U;
  constructor(it: Iterator<T>, f: (t: T) => U) {
    this.it = it;
    this.f = f;
  }

  current(): U {
    return this.f(this.it.current());
  }
  advance(): boolean {
    return this.it.advance();
  }
}

export class Iterator$filter<X> implements Iterator<X> {
  ix: Iterator<X>;
  p: (x: X) => boolean;
  
  constructor(ix: Iterator<X>, p: (x: X) => boolean) {
    this.ix = ix;
    this.p = p;
  }

  current(): X {
    return this.ix.current();
  }

  advance(): boolean {
    do {
      const hasNext = this.ix.advance();
      if (!hasNext) return false;
    } while (!this.p(this.ix.current()))
    return true;
  }
}

export class Iterator$zipWith<X, Y, Z> implements Iterator<Z> {
  ix: Iterator<X>; 
  iy: Iterator<Y>;
  f: (x: X, y: Y) => Z;
  constructor(ix: Iterator<X>, iy: Iterator<Y>, f: (x: X, y: Y) => Z) {
    this.ix = ix;
    this.iy = iy;
    this.f = f;
  }
  current(): Z {
    return this.f(this.ix.current(), this.iy.current());
  }
  advance(): boolean {
    return this.ix.advance() && this.iy.advance();
  }
}

export class Iterator$zip<X, Y> extends Iterator$zipWith<X, Y, [X, Y]> {
  constructor(ix: Iterator<X>, iy: Iterator<Y>) {
    super(ix, iy, (x, y) => [x ,y]);
  }
}


const EmptyIterator: Iterator<never> = new class {
  current(): never {
    throw new Error('Cannot access current on EmptyIterator.');
  }
  advance(): boolean {
    return false;
  }
}


/**
 * A conversion from Collection.ts iterator to TypeScript iterator.
 */
export class TSIterator<T> {
  iter: Iterator<T>;

  /**
   * Converts a Collection.ts iterator to TypeScript iterator. 
   * @param iter A Collection.ts iterator
   */
  constructor(iter: Iterator<T>) {
    this.iter = iter;
  }
  next(): IteratorResult<T> {
    const done = !this.iter.advance();
    const value = done ? null : this.iter.current();
    return {
      done: done,
      value: value
    }
  }
}
