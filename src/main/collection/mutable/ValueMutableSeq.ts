import { Seq } from '../Seq';

export abstract class ValueMutableSeq<T> extends Seq<T> {

  abstract update(idx: number, t: T): void;

  swap(i: number, j: number): void {
    const t = this.apply(i);
    this.update(i, this.apply(j));
    this.update(j, t);
  }
  
}