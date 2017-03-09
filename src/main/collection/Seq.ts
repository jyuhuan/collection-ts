import { Iterable } from './Iterable';
import { Iterator } from './Iterator';
import { Eq } from './Eq';
import { Map } from './Map';
import { Set } from './Set';

export abstract class Seq<X> extends Iterable<X> {
  abstract head(): X;
  abstract tail(): Seq<X>;
  abstract isEmpty(): boolean;

  notEmpty() {
    return !this.isEmpty();
  }

  get(idx: number): X {
    return this.tailAt(idx).head();
  }

  tailAt(idx: number): Seq<X> {
    if (idx < 0) throw new Error(`Index ${idx} is out of bounds!`);
    let cur: Seq<X> = this;
    let i = 0;
    while (i < idx) {
      if (cur.tail().isEmpty()) throw new Error(`Index ${idx} is out of bounds!`);
      i += 1;
      cur = cur.tail();
    }
    return cur;
  }

  length(): number {
    let cur: Seq<X> = this;
    let len = 0;
    while (cur.notEmpty()) {
      len += 1;
      cur = cur.tail();
    }
    return len;
  }

  map<Y>(f: (x: X) => Y): Seq<Y> {
    return new Seq$map(this, f);
  }

  filter(p: (x: X) => boolean): Seq<X> {
    return new Seq$filter(this, p);
  }

  newIterator(): Iterator<X> {
    return new Seq$newIterator(this);
  }
}

class Seq$$Concrete<X> extends Seq<X> {

  x: X;
  next: Seq<X>;
  empty: boolean;
  constructor(x: X, next: Seq<X>, empty: boolean) {
    super();
    this.x = x;
    this.next = next;
    this.empty = empty;
  }

  head(): X {
    return this.x;
  }
  tail(): Seq<X> {
    return this.next;
  }
  isEmpty(): boolean {
    return this.empty;
  }

}


class Seq$map<X, Y> extends Seq<Y> {
  seq: Seq<X>;
  f: (x: X) => Y;
  constructor(seq: Seq<X>, f: (x: X) => Y) {
    super();
    this.seq = seq;
    this.f = f;
  }
  head(): Y {
    return this.f(this.seq.head());
  }
  tail(): Seq<Y> {
    return this.seq.tail().map(this.f);
  }
  isEmpty(): boolean {
    return this.seq.isEmpty();
  }
}


class Seq$filter<X> extends Seq<X> {
  h: Seq<X>;
  p: (x: X) => boolean;
  
  constructor(seq: Seq<X>, p: (x: X) => boolean) {
    super();
    this.h = seq;
    this.p = p;
    while (this.h.notEmpty() && !this.p(this.h.head())) this.h = this.h.tail();
    this.p = p;
  }

  head(): X {
    return this.h.head();
  }

  tail(): Seq<X> {
    return this.h.tail().filter(this.p);
  }

  isEmpty(): boolean {
    return this.h.isEmpty();
  }

}


class Seq$newIterator<X> implements Iterator<X> {
  cur: Seq<X>;
  constructor(seq: Seq<X>) {
    this.cur = new Seq$$Concrete(null, seq, false);
  }
  current(): X {
    return this.cur.head();
  }
  advance(): boolean {
    this.cur = this.cur.tail();
    return !this.cur.isEmpty();
  }
}
