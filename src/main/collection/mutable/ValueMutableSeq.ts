import { Seq } from '../Seq';

export abstract class ValueMutableSeq<X> extends Seq<X> {

  abstract changeTo(x: X): void;
  abstract tail(): ValueMutableSeq<X>;

  set(idx: number, x: X): void {
    const a: ValueMutableSeq<X> = this.tailAt(idx);
  }

  // Code is almost the same as in Seq
  tailAt(idx: number): ValueMutableSeq<X> {
    if (idx < 0) throw new Error(`Index ${idx} is out of bounds!`);
    let cur: ValueMutableSeq<X> = this;
    let i = 0;
    while (i < idx) {
      if (cur.tail().isEmpty()) throw new Error(`Index ${idx} is out of bounds!`);
      i += 1;
      cur = cur.tail();
    }
    return cur;
  }
  
  swap(i: number, j: number): void {
    const nodeI = this.tailAt(i);
    const nodeJ = this.tailAt(j);
    const t = nodeI.head();
    nodeI.changeTo(nodeJ.head());
    nodeJ.changeTo(t);
  }

  abstract reverse(): void;
  abstract reverseSubseq(start: number, end: number): void;
  
}