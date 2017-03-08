import { LinkedList, LinkedNode } from '../base/LinkedList';
import { KeyMutableSeq } from './KeyMutableSeq';
import { Eq } from '../Eq';
import { Iterator } from '../Iterator';

export class LinkedSeq<X> extends KeyMutableSeq<X> {

  lst: LinkedList<X>
  
  constructor(linkedList: LinkedList<X>) {
    super();
    this.lst = linkedList;
  }

  prepend(x: X): void {
    this.lst.prepend(x);
  }

  append(x: X): void {
    this.lst.append(x);
  }

  clear(): void {
    this.lst.clear();
  }

  insert(idx: number, x: X): void {
    this.lst.insert(idx, x);
  }

  set(idx: number, x: X): void {
    this.lst.set(idx, x);
  }

  get(idx: number): X {
    return this.lst.get(idx);
  }

  length(): number {
    return this.lst.length();
  }

  reversed(): LinkedSeq<X> {
    return null;
  }

  reverse(): void {
    this.lst.reverse();
  }

  reverseSubseq(start: number, end: number): void {
    this.lst.reverseSublist(start, end);
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
    this.cur = l.lst.dummy;
  }

  current(): X {
    return this.cur.data;
  }
  advance(): boolean {
    this.cur = this.cur.next;
    return this.cur != null;
  }

}