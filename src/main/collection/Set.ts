import { Eq } from './strategy/Eq';
import { Iterable } from './Iterable';
//import { Func } from './Funcs';

export abstract class Set<K> /*extends Func<K, boolean>*/ {
  
  // constructor() {
  //   super((k: K) => this.has(k));
  // }

  abstract has(k: K): boolean;
  hasNot(k: K): boolean { return !this.has(k); }

  abstract keys(): Iterable<K>;
  elements(): Iterable<K> {
    return this.keys();
  }

  size(): number {
    return this.keys().size();
  }

  isEmpty(): boolean {
    return this.size() == 0;
  }

  notEmpty(): boolean {
    return !this.isEmpty();
  }

  intersect(that: Set<K>): Set<K> {
    return new Set$intersect(this, that);
  }

  union(that: Set<K>): Set<K> {
    return new Set$union(this, that);
  }

  cartesianProduct<K1>(that: Set<K1>): Set<[K, K1]> {
    return new Set$cartesianProduct(this, that);
  }

  filter(p: (k: K) => boolean): Set<K> {
    return new Set$filter(this, p);
  }

  toString(): string {
    return this.keys().toString();
  }

}


class Set$union<X> extends Set<X> {
  set1: Set<X>;
  set2: Set<X>;
  constructor(set1: Set<X>, set2: Set<X>) {
    super();
    this.set1 = set1;
    this.set2 = set2;
  }
  has(k: X): boolean {
    return this.set1.has(k) && this.set2.has(k);
  }
  keys(): Iterable<X> {
    const part1 = this.set1.keys();
    const part2 = this.set2.keys().filter(k => this.set1.hasNot(k));
    return part1.concat(part2);
  }
}


class Set$intersect<X> extends Set<X> {
  set1: Set<X>;
  set2: Set<X>;
  constructor(set1: Set<X>, set2: Set<X>) {
    super();
    this.set1 = set1;
    this.set2 = set2;
  }
  has(k: X): boolean {
    return this.set1.has(k) && this.set2.has(k);
  }
  keys(): Iterable<X> {
    // Do not simply `filter((x: X) => this.set2.has(x))` to `filter(this.set2.has)`
    return this.set1.filter((x: X) => this.set2.has(x)).keys();
  }
}


class Set$filter<X> extends Set<X> {
  _set: Set<X>;
  p: (x: X) => boolean;
  constructor(_set: Set<X>, p: (x: X) => boolean) {
    super();
    this._set = _set;
    this.p = p;
  }
  has(k: X): boolean {
    return this._set.has(k) && this.p(k);
  }
  keys(): Iterable<X> {
    return this._set.keys().filter(this.p);
  }
}


class Set$cartesianProduct<K1, K2> extends Set<[K1, K2]> {
  set1: Set<K1>;
  set2: Set<K2>;
  constructor(set1: Set<K1>, set2: Set<K2>) {
    super();
    this.set1 = set1;
    this.set2 = set2;
  }
  has(k: [K1, K2]): boolean {
    return this.set1.has(k[0]) && this.set2.has(k[1]);
  }
  keys(): Iterable<[K1, K2]> {
    return this.set1.keys().cartesianProduct(this.set2.keys());
  }
}