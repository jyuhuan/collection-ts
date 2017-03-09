import { Seq } from './Seq';
import { Iterator } from './Iterator';

export abstract class RandomAccessSeq<X> extends Seq<X> {

  abstract fastGet(idx: number): X;
  
  get(idx: number) {
    return this.fastGet(idx);
  }


  newIterator() {
    return new RandomAccessSeq$newIterator(this);
  }
}



/**
 * Represents an iterator for a sequence.
 */
class RandomAccessSeq$newIterator<X> implements Iterator<X> {

  seq: RandomAccessSeq<X>;
  constructor(seq: RandomAccessSeq<X>) {
    this.seq = seq;
  }

  i = -1;

  current(): X {
    return this.seq.fastGet(this.i);
  }

  advance(): boolean {
    this.i += 1;
    return this.i < this.seq.length();
  }

}



// Should really be defined in Range.ts, but TypeScript can't handle circular imports. 
export class Range extends RandomAccessSeq<number> {
  start: number;
  end: number;
  constructor(start: number, end: number) {
    super();
    this.start = start;
    this.end = end;
  }

  fastGet(idx: number): number {
    return this.start + idx;
  }
  length(): number {
    return this.end - this.start;
  }
  reversed(): Seq<number> {
    return new ReversedRange(this);
  }
}

export class ReversedRange extends RandomAccessSeq<number> {

  original: Range;
  constructor(original: Range) {
    super();
    this.original = original;
  }

  fastGet(idx: number): number {
    return this.original.end - idx - 1;
  }
  length(): number {
    return this.original.length();
  }
  reversed(): Seq<number> {
    return this.original;
  }

}

