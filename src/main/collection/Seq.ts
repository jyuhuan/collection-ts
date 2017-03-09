import { Iterable } from './Iterable';
import { Iterator } from './Iterator';
import { Eq } from './Eq';
import { Map } from './Map';
import { Set } from './Set';

/**
 * Represents a sequence.
 * 
 * A sequence is an iterable that defines a linear order of elements. 
 * The elements are indexed by integer numbers starting from 0 until the length of the sequence. 
 * A sequence can be indexed by the `get` method. 
 * A reversed copy of the sequence can be obtained by the `reversed` method.
 * 
 * Sequences support finding occurrences of elements or subsequences by providing methods such as
 * `segmentLength`, `prefixLength`, `indexWhere`, `indexOf`, `lastIndexWhere`, `lastIndexOf`, 
 * `startsWith`, `endsWidth`, `indexOfSlice`.
 * 
 */
export abstract class Seq<X> extends Iterable<X> {

  get(idx: number): X {
    let i = -1;
    const iter = this.newIterator();
    while (i < idx) {
      i += 1;
      iter.advance()
    }
    return iter.current();
  }

  abstract length(): number;

  indexOf(x: X): number {
    return this.indexWhere(y => x === y);
  }

  indexOfUnder(x: X, e: Eq<X>): number {
    return this.indexWhere(y => e.eq(y, x))
  }

  indexWhere(f: (x: X) => boolean): number {
    const iter = this.newIterator();
    let i = 0;
    while(iter.advance()) {
      if (f(iter.current())) return i;
      i += 1;
    }
    return -1;
  }

  reversed(): Seq<X> {
    return new Seq$reversed(this);
  }


  //region HIGHER-ORDER FUNCTIONS

  map<Y>(f: (x: X) => Y): Seq<Y> {
    return new Seq$map(this, f);
  }

  //endregion

  // abstract lastIndexOf(x: X): number;
  // abstract lastIndexWhere(f: (x: X) => boolean): number;

}



class Seq$asMap<X> extends Map<number, X> {
  seq: Seq<X>;
  constructor(seq: Seq<X>) {
    super();
    this.seq = seq;
  }
  get(idx: number): X {
    return this.seq.get(idx);
  }
  keySet(): Set<number> {
    return new Seq$asMap$keySet(this.seq.size());
  }
}


class Seq$asMap$keySet extends Set<number> {
  seqSize: number;
  constructor(seqSize: number) {
    super();
    this.seqSize = seqSize;
  }
  keyEq(): Eq<number> {
    return { eq: (i, j) => i === j };
  }
  has(k: number): boolean {
    return 0 <= k && k < this.seqSize;
  }
  keys(): Iterable<number> {
   return new Seq$asMap$keySet$keys(0, this.seqSize);
  }
}

class Seq$asMap$keySet$keys extends Iterable<number> {
  start: number;
  end: number;
  constructor(start: number, end: number) {
    super();
    this.start = start;
    this.end = end;
  }

  newIterator(): Iterator<number> {
    return new Seq$asMap$keySet$keys$newIterator(this.start, this.end);
  }

}

class Seq$asMap$keySet$keys$newIterator implements Iterator<number> {
  start: number;
  end: number;
  i: number;
  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.i = start - 1;
  }

  current(): number {
    return this.i;
  }
  advance(): boolean {
    this.i += 1;
    return this.i < this.end;
  }

}

class Seq$reversed<X> extends Seq<X> {
  xs: Seq<X>;
  constructor(xs: Seq<X>) {
    super();
    this.xs = xs;
  }
  length(): number {
    return this.xs.length();
  }
  newIterator(): Iterator<X> {
    return new Seq$reversed$newIterator(this.xs);
  } 
}

class Seq$reversed$newIterator<X> implements Iterator<X> {
  arr: Array<X>;
  i: number;
  constructor(seq: Seq<X>) {
    this.arr = new Array<X>(seq.length());
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

class Seq$map<X, Y> extends Seq<Y> {
  xs: Seq<X>;
  f: (x: X) => Y;
  constructor(xs: Seq<X>, f: (x: X) => Y) {
    super();
    this.xs = xs;
    this.f = f;
  }
  length(): number {
    return this.xs.length();
  }
  newIterator(): Iterator<Y> {
    return new Seq$map$newIterator(this.xs, this.f);
  }
}

class Seq$map$newIterator<X, Y> implements Iterator<Y> {

  iter: Iterator<X>;
  f: (x: X) => Y;
  constructor(xs: Seq<X>, f: (x: X) => Y) {
    this.iter = xs.newIterator();
    this.f = f;
  }

  current(): Y {
    return this.f(this.iter.current());
  }
  advance(): boolean {
    return this.iter.advance();
  }

}