import { Iterator, MappedIterator, TSIterator } from './Iterator';

export abstract class Iterable<T> {
  abstract newIterator(): Iterator<T>;

  map<U>(f: (t: T) => U): Iterable<U> {
    return new MappedIterable(this, f);
  }

  // Conforms to TypeScript iterable to allow for..of syntax
  [Symbol.iterator]() {
    return new TSIterator<T>(this.newIterator());
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