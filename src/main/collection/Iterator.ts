export interface Iterator<T> {
  current(): T;
  advance(): boolean;
}


export class ConcatenatedIterator<X> implements Iterator<X> {
  iter1: Iterator<X>; 
  iter2: Iterator<X>;
  curIter: Iterator<X>;
  isFirst: boolean;

  constructor(iter1: Iterator<X>, iter2: Iterator<X>) {
    this.iter1 = iter1;
    this.iter2 = iter2;
    this.curIter = iter1;
    this.isFirst = true;
  }

  current(): X {
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

export class MappedIterator<T, U> implements Iterator<U> {
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

export class FilteredIterator<X> implements Iterator<X> {
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

export class TSIterator<T> {
  iter: Iterator<T>;
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
