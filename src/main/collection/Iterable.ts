import { Iterator, MappedIterator, TSIterator, FilteredIterator, ConcatenatedIterator } from './Iterator';

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
    let i = 0;
    const iter = this.newIterator();
    while (iter.advance()) {
      i += 1;
    }
    return i;
  }


  //region Operations between Iterables

  concat(that: Iterable<X>): Iterable<X> {
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

  //endregion

  /**
   * Conforms to TypeScript iterable to enable `for..of` syntax
   */
  [Symbol.iterator]() {
    return new TSIterator<X>(this.newIterator());
  }
}


class ConcatenatedIterable<X> extends Iterable<X> {
  ix1: Iterable<X>;
  ix2: Iterable<X>;
  
  constructor(ix1: Iterable<X>, ix2: Iterable<X>) {
    super();
    this.ix1 = ix1;
    this.ix2 = ix2;
  }

  newIterator(): Iterator<X> {
    return new ConcatenatedIterator<X>(this.ix1.newIterator(), this.ix2.newIterator());
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