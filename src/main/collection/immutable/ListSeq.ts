import { LinkedList, LinkedNode } from '../base/LinkedList';
import { Eq } from '../Eq';
import { Iterator } from '../Iterator';
import { Seq } from '../Seq';

export class ListSeq<X> extends Seq<X> {

  x: X;
  next: ListSeq<X>;
  dummy: ListSeq<X>;

  constructor(x: X, next: ListSeq<X>) {
    super();
    this.x = x;
    this.next = next;
  }

  head(): X {
    return this.x;
  }

  tail(): ListSeq<X> {
    return this.next;
  }

  isEmpty(): boolean {
    return false;
  }

  static from<X>(...elems: X[]): ListSeq<X> {
    let head = new EmptyListSeq<X>();  
    for (let i = elems.length - 1; i >= 0; i--) {
      head = new ListSeq(elems[i], head);
    }
    return head;
  }

}


class EmptyListSeq<X> extends ListSeq<X> {
  constructor() {
    super(null, null); // can't write super(null, this)
  }

  isEmpty() {
    return true;
  }
}