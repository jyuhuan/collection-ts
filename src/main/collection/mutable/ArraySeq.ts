import { Seq } from '../Seq';
import { ExpandableArray } from '../base/ExpandableArray';

export class ArraySeq<T> extends Seq<T> {
  
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


  //

  static from<T>(...ts: T[]) {
    return new ArraySeq(ExpandableArray.from(...ts));
  }

}