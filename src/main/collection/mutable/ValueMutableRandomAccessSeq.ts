import { RandomAccessSeq } from '../RandomAccessSeq';

// Had to copy code from ValueMutableSeq, because TypeScript doesn't allow multiple inheritance.
export abstract class ValueMutableRandomAccessSeq<X> extends RandomAccessSeq<X> {
  abstract set(idx: number, x: X): void;

  swap(i: number, j: number): void {
    const t = this.get(i);
    this.set(i, this.get(j));
    this.set(j, t);
  }

  abstract reverse(): void;
  abstract reverseSubseq(start: number, end: number): void;

}