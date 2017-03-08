import { LinkedList, LinkedNode } from '../base/LinkedList';
import { KeyMutableSeq } from './KeyMutableSeq';
import { Eq } from '../Eq';
import { Iterator } from '../Iterator';

export class LinkedSeq<X> extends KeyMutableSeq<X> {

  ll: LinkedList<X>
  
  constructor(linkedList: LinkedList<X>) {
    super();
    this.ll = linkedList;
  }

  prepend(x: X): void {
    this.ll.prepend(x);
  }

  append(x: X): void {
    this.ll.append(x);
  }

  clear(): void {
    this.ll.clear();
  }

  insert(idx: number, x: X): void {
    this.ll.insert(idx, x);
  }

  set(idx: number, x: X): void {
    this.ll.set(idx, x);
  }

  get(idx: number): X {
    return this.ll.get(idx);
  }

  length(): number {
    return this.ll.length();
  }

  newIterator(): Iterator<X> {
    return new LinkedSeqIterator<X>(this);
  }

  static from<X>(...xs: X[]) {
    return new LinkedSeq(LinkedList.from(...xs));
  }

}

class LinkedSeqIterator<X> implements Iterator<X> {

  l: LinkedSeq<X>;
  cur: LinkedNode<X>;

  constructor(l: LinkedSeq<X>) {
    this.l = l;
    this.cur = l.ll.dummy;
  }

  current(): X {
    return this.cur.data;
  }
  advance(): boolean {
    this.cur = this.cur.next;
    return this.cur != null;
  }

}