import { StringBuilder } from './util/StringBuilder';
import { Iterator, MappedIterator, TSIterator, FilteredIterator, ConcatenatedIterator, ZippedWithIterator } from './Iterator';

export abstract class Iterable<X> {
  abstract newIterator(): Iterator<X>;

  /**
   * Returns a valid size if the size of this iterable is immediately ready. 
   * Otherwise, returns -1.
   */
  knownSize(): number {
    return -1;
  }

  /**
   * The number of elements in this iterable. 
   */
  size(): number {
    // If the size is known (e.g., this.knownSize() is overriden by a subclass),
    // return that size
    if (this.knownSize() > 0) return this.knownSize();

    // If not
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

  //region Operations between Iterables

  concat<Y>(that: Iterable<Y>): Iterable<X|Y> {
    return new ConcatenatedIterable(this, that);
  }

  //endregion


  //region HIGHER-ORDER FUNCTIONS

  map<U>(f: (t: X) => U): Iterable<U> {
    return new MappedIterable(this, f);
  }

  filter(p: (x: X) => boolean): Iterable<X> {
    return new FilteredIterable(this, p);
  }

  zip<Y>(that: Iterable<Y>): Iterable<[X, Y]> {
    return new ZippedIterable(this, that);
  }

  zipWith<Y, Z>(that: Iterable<Y>, f: (x: X, y: Y) => Z) {
    return new ZippedWithIterable(this, that, f);
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


class ConcatenatedIterable<X, Y> extends Iterable<X|Y> {
  ix: Iterable<X>;
  iy: Iterable<Y>;
  
  constructor(ix: Iterable<X>, iy: Iterable<Y>) {
    super();
    this.ix = ix;
    this.iy = iy;
  }

  newIterator(): Iterator<X|Y> {
    return new ConcatenatedIterator(this.ix.newIterator(), this.iy.newIterator());
  }
}

class MappedIterable<T, U> extends Iterable<U> {

  it: Iterable<T>;
  f: (t: T) => U
  constructor(it: Iterable<T>, f: (t: T) => U) {
    super();
    this.it = it;
    this.f = f;
  }

  newIterator(): Iterator<U> {
    return new MappedIterator(this.it.newIterator(), this.f);
  }

}


class FilteredIterable<X> extends Iterable<X> {
  ix: Iterable<X>;
  p: (x: X) => boolean;
  
  constructor(ix: Iterable<X>, p: (x: X) => boolean) {
    super();
    this.ix = ix;
    this.p = p;
  }

  newIterator(): Iterator<X> {
    return new FilteredIterator(this.ix.newIterator(), this.p);
  }
}

class ZippedWithIterable<X, Y, Z> extends Iterable<Z> {
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
    return new ZippedWithIterator(this.ix.newIterator(), this.iy.newIterator(), this.f);
  }
}

class ZippedIterable<X, Y> extends ZippedWithIterable<X, Y, [X, Y]> {
  constructor(ix: Iterable<X>, iy: Iterable<Y>) {
    super(ix, iy, (x, y) => [x, y]);
  }
}
