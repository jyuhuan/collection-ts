import { Iterable } from './Iterable';
import { Iterator } from './Iterator';
import { Eq } from './Eq';
import { Map } from './Map';
import { Set } from './Set';
import { Range } from './Range';

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

  abstract get(idx: number): X;
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

  abstract reversed(): Seq<X>;  // Using the implementation from ArraySeq will result in error.

  // abstract lastIndexOf(x: X): number;
  // abstract lastIndexWhere(f: (x: X) => boolean): number;

  newIterator(): Iterator<X> { return new Seq$newIterator(this); }
}


/**
 * Represents an iterator for a sequence.
 */
class Seq$newIterator<X> implements Iterator<X> {

  seq: Seq<X>;
  constructor(seq: Seq<X>) {
    this.seq = seq;
  }

  i = -1;

  current(): X {
    return this.seq.get(this.i);
  }

  advance(): boolean {
    this.i += 1;
    return this.i < this.seq.length();
  }

}


class Set$asMap<X> extends Map<number, X> {
  seq: Seq<X>;
  constructor(seq: Seq<X>) {
    super();
    this.seq = seq;
  }
  get(idx: number): X {
    return this.seq.get(idx);
  }
  keySet(): Set<number> {
    return new Set$asMap$keySet(this.seq.size());
  }
}

class Set$asMap$keySet extends Set<number> {
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
    return new Range(0, this.seqSize);
  }
}

