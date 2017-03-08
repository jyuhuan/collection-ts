import { Seq } from '../Seq';

export abstract class ValueMutableSeq<X> extends Seq<X> {

  abstract set(idx: number, x: X): void;

  swap(i: number, j: number): void {
    const t = this.get(i);
    this.set(i, this.get(j));
    this.set(j, t);
  }
  
}