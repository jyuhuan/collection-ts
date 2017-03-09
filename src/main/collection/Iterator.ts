export interface Iterator<T> {
  current(): T;
  advance(): boolean;
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
