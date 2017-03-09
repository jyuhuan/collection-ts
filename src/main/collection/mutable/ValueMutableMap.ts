import { Map } from '../Map';

export abstract class ValueMutableMap<K, V> extends Map<K, V> {
  abstract set(k: K, v: V): void;
  
  mapValuesInplace(f: (v: V) => V): void {
    for (const k of this.keySet().keys()) {
      this.set(k, f(this.get(k)));
    }
  }
}