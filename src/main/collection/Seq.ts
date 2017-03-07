import { Iterable } from './Iterable';
import { Iterator } from './Iterator';

export abstract class Seq<T> extends Iterable<T> {
  abstract apply(idx: number): T
  abstract length(): number

  newIterator(): Iterator<T> {
    return new SeqIterator(this);
  }
}


class SeqIterator<T> extends Iterator<T> {

  seq: Seq<T>;
  constructor(seq: Seq<T>) {
    super();
    this.seq = seq;
  }

  i = -1;

  current(): T {
    return this.seq.apply(this.i);
  }

  advance(): boolean {
    this.i += 1;
    return this.i < this.seq.length();
  }

}