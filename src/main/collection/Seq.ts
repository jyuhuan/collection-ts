import { Iterable } from './Iterable';
import { Iterator } from './Iterator';
import { Eq } from './strategy/Eq';
import { Map } from './Map';
import { Set } from './Set';

export abstract class Seq<X> extends Iterable<X> {
  abstract head(): X;
  abstract tail(): Seq<X>;
  abstract isEmpty(): boolean;

  dummyHead(): Seq<X> {
    return new DummySeqHeading(this);
  }

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

  flatMap<Y>(f: (x: X) => Seq<Y>): Seq<Y> {
    return new Seq$flatMap(this.dummyHead(), new DummySeq(), f).tail();
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


class Seq$flatMap<X, Y> extends Seq<Y> {

  outer: Seq<X>;
  inner: Seq<Y>;
  f: (x: X) => Seq<Y>;

  constructor(outer: Seq<X>, inner: Seq<Y>, f: (x: X) => Seq<Y>) {
    super();
    this.outer = outer;
    this.inner = inner;
    this.f = f;
  }

  head(): Y {
    return this.inner.head();
  }

  tail(): Seq$flatMap<X, Y> {
    const innerNext = this.inner.tail();
    if (innerNext.notEmpty()) {
      return new Seq$flatMap(this.outer, innerNext, this.f);
    }
    else {
      let newOuter = this.outer.tail();
      let newInner: Seq<Y> = new DummySeq;
      if (newOuter.notEmpty()) newInner = this.f(newOuter.head());
      while (newOuter.notEmpty()) {
        if (newInner.notEmpty()) return new Seq$flatMap(newOuter, newInner, this.f);
        newOuter = newOuter.tail();
        newInner = this.f(newOuter.head());
      }
      return new Seq$flatMap(newOuter, newInner, this.f);
    }
  }

  isEmpty(): boolean {
    return this.outer.isEmpty();
  }
}


class Seq$filter<X> extends Seq<X> {
  d: Seq<X>;
  p: (x: X) => boolean;
  
  constructor(d: Seq<X>, p: (x: X) => boolean) {
    super();
    this.d = d;
    this.p = p;
  }

  head(): X {
    return this.d.head();
  }

  tail(): Seq<X> {
    let t = this.d.tail();
    while (t.notEmpty() && !this.p(t.head())) {
      t = t.tail();
    }
    return new Seq$filter(t, this.p);
  }

  isEmpty(): boolean {
    return this.d.isEmpty();
  }

}


class Seq$newIterator<X> implements Iterator<X> {
  cur: Seq<X>;
  constructor(seq: Seq<X>) {
    this.cur = seq.dummyHead();
  }
  current(): X {
    return this.cur.head();
  }
  advance(): boolean {
    this.cur = this.cur.tail();
    return this.cur.notEmpty();
  }
}

class DummySeq extends Seq<never> {
  head(): never {
    throw new Error('Cannot access head of a dummy Seq.');
  }
  tail(): Seq<never> {
    return this;
  }
  isEmpty(): boolean {
    return true;
  }
}

class DummySeqHeading<X> extends Seq<X> {

  seq: Seq<X>;
  constructor(seq: Seq<X>) {
    super();
    this.seq = seq;
  }

  head(): X {
    throw new Error('Cannot access head of a dummy Seq.');
  }
  tail(): Seq<X> {
    return this.seq;
  }
  isEmpty(): boolean {
    return true;
  }

}
