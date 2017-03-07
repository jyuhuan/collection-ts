export abstract class Iterator<T> {
  abstract current(): T;
  abstract advance(): boolean;
}

export class MappedIterator<T, U> extends Iterator<U> {
  it: Iterator<T>;
  f: (t: T) => U;
  constructor(it: Iterator<T>, f: (t: T) => U) {
    super();
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
