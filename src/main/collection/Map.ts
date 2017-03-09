import { Set } from './Set';
import { Iterable } from './Iterable';

export abstract class Map<K, V> {
  abstract get(k: K): V;
  abstract keySet(): Set<K>;

  hasKey(k: K) {
    return this.keySet().has(k);
  }

  values(): Iterable<V> {
    return this.keySet().keys().map(k => this.get(k));
  }

  pairs(): Iterable<[K, V]> {
    return this.keySet().keys().map(k => {
      let pair: [K, V];
      pair = [k, this.get(k)];
      return pair;
    })
    // Typescript fails to infer correct type when using a shorter version of this code
  }

  getOrElse(k: K, defaultValue: () => V): V {
    return this.hasKey(k) ? this.get(k) : defaultValue();
  }

  size() {
    return this.keySet().size();
  }

  isEmpty() {
    return this.size() === 0;
  }

  notEmpty() {
    return !this.isEmpty();
  }

}