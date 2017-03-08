import { Eq } from './Eq';
import { Iterable } from './Iterable';
export abstract class Set<K> {
  
  abstract keyEq(): Eq<K>;

  abstract has(k: K): boolean;
  hasNot(k: K): boolean { return !this.has(k); }

  abstract keys(): Iterable<K>;

  size(): number {
    return this.keys().size();
  }

  isEmpty(): boolean {
    return this.size() == 0;
  }

  notEmpty(): boolean {
    return !this.isEmpty();
  }

}

class UnionedSet<X> extends Set<X> {
  set1: Set<X>;
  set2: Set<X>;

  constructor(set1: Set<X>, set2: Set<X>) {
    super();
    this.set1 = set1;
    this.set2 = set2;
  }

  keyEq(): Eq<X> {
    return this.set1.keyEq();  // Assumes same Eq on both sets. 
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