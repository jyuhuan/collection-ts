import { ExpandableArray } from '../base/ExpandableArray';
import { Eq } from '../strategy/Eq';
import { KeyMutableRandomAccessSeq } from './KeyMutableRandomAccessSeq';

export class ArraySeq<T> extends KeyMutableRandomAccessSeq<T> {

  arr: ExpandableArray<T>;

  constructor(data: ExpandableArray<T>) {
    super();
    this.arr = data;
  }

  fastGet(idx: number): T {
    return this.arr.at(idx);
  }

  fastLength(): number {
    return this.arr.size;
  }

  prepend(x: T): void {
    this.arr.prepend(x);
  }
  append(x: T): void {
    this.arr.append(x);
  }
  clear(): void {
    this.arr.clear();
  }
  insert(idx: number, x: T): void {
    this.arr.insert(idx, x);
  }
  set(idx: number, t: T): void {
    this.arr.set(idx, t);
  }

  reversed(): ArraySeq<T> {
    return new ArraySeq<T>(this.arr.reversed());
  }

  reverse(): void {
    this.arr.reverse();
  }

  reverseSubseq(start: number, end: number): void {
    this.arr.reverseSubarray(start, end);
  }

  //

  static from<T>(...ts: T[]) {
    return new ArraySeq(ExpandableArray.from(...ts));
  }

  static tabulate<X>(n: number, f: (i: number) => X) {
    const xs: X[] = new Array<X>(n);
    for (let i = 0; i < n; i++) xs[i] = f(i);
    return ArraySeq.from<X>(...xs);
  }

}