export interface Iterator<T> {
  current(): T;
  advance(): boolean;
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
