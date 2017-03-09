import { Iterable } from './Iterable';
import { Iterator } from './Iterator';
import { Seq } from './Seq';

export class Range extends Seq<number> {
  start: number;
  end: number;
  constructor(start: number, end: number) {
    super();
    this.start = start;
    this.end = end;
  }

  get(idx: number): number {
    return this.start + idx;
  }
  length(): number {
    return this.end - this.start;
  }
  reversed(): Seq<number> {
    return new ReversedRange(this);
  }
}

export class ReversedRange extends Seq<number> {

  original: Range;
  constructor(original: Range) {
    super();
    this.original = original;
  }

  get(idx: number): number {
    return this.original.end - idx - 1;
  }
  length(): number {
    return this.original.length();
  }
  reversed(): Seq<number> {
    return this.original;
  }

}

