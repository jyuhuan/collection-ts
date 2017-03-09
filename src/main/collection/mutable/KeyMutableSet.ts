import { Set } from '../Set';
import { Iterable } from '../Iterable';

export abstract class KeyMutableSet<K> extends Set<K> {

  abstract add(x: K): void;
  addAll(ks: Iterable<K>) {
    for (const k of ks) this.add(k);
  }

  abstract remove(k: K): void;
  removeAll(ks: Iterable<K>) {
    for (const k of ks) this.remove(k);
  }

  abstract clear(): void;

  unionInplace(ks: Set<K>): void {
    for (const k of ks.elements()) this.add(k);
  }

  // retainInplace(ks: Iterable<K>): void {

  // }

}