import { KeyMutableSeq } from './KeyMutableSeq';
import { ExpandableArray } from '../base/ExpandableArray';

export class ArraySeq<T> extends KeyMutableSeq<T> {

  data: ExpandableArray<T>;

  constructor(data: ExpandableArray<T>) {
    super();
    this.data = data;
  }

  apply(idx: number): T {
    return this.data.at(idx);
  }

  length(): number {
    return this.data.size;
  }

  prepend(x: T): void {
    this.data.prepend(x);
  }
  append(x: T): void {
    this.data.append(x);
  }
  clear(): void {
    this.data.clear();
  }
  insert(idx: number, x: T): void {
    this.data.insert(idx, x);
  }
  update(idx: number, t: T): void {
    this.data.update(idx, t);
  }



  //

  static from<T>(...ts: T[]) {
    return new ArraySeq(ExpandableArray.from(...ts));
  }

  static tabulate<X>(n: number, f: (i: number) => X) {
    const xs = new Array<X>(n);
    for (let i = 0; i < n; i++) xs[i] = f(i);
    return ArraySeq.from(xs);
  }

}