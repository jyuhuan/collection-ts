import { Set } from './Set';
import { Iterable } from './Iterable';
//import { Func } from './Funcs';

export abstract class Map<K, V> /**extends Func<K, V>**/ {

  // // This enables using this map as a function.
  // constructor() {
  //   super((k: K) => this.get(k));
  // }

  /**
   * Retrieves the value associated with the given key.
   * @param k The key whose associated value is to be retrieved.
   */
  abstract get(k: K): V;

  /**
   * The set of keys in this map.
   */
  abstract keySet(): Set<K>;

  /**
   * Determines whether the given key exists in this map. 
   * @param k The target key.
   */
  hasKey(k: K) {
    return this.keySet().has(k);
  }

  /**
   * All values stored in this map. 
   */
  values(): Iterable<V> {
    return this.keySet().keys().map(k => this.get(k));
  }

  /**
   * All pairs stored in this map. 
   */
  pairs(): Iterable<[K, V]> {
    return this.keySet().keys().map(k => {
      let pair: [K, V];
      pair = [k, this.get(k)];
      return pair;
    })
    // Typescript fails to infer correct type when using a shorter version of this code
  }

  /**
   * 
   * @param k The key whose associated value is to be retrieved. 
   * @param defaultValue A default value which is used in case the provided key is not 
   *        associated with any value. 
   * 
   *        By defining this as a supplier function mimics the pass-by-name policy.
   *        This is useful when, for example, a random value must be returned when the
   *        key does not exist. 
   */
  getOrElse(k: K, defaultValue: () => V): V {
    return this.hasKey(k) ? this.get(k) : defaultValue();
  }

  /**
   * The size of the map. 
   * 
   * This is equal to 
   *  - The number of keys.
   *  - The number of pairs.
   */
  size() {
    return this.keySet().size();
  }

  /**
   * Determines if this map is empty. 
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * Determines if this map is not empty.
   */
  notEmpty() {
    return !this.isEmpty();
  }


  cartesianProductWith<K1, V1, A>(that: Map<K1, V1>, f: (V, V1) => A): Map<[K, K1], A> {
    return new Map$cartesianProductWith(this, that, f);
  }

  cartesianProduct<K1, V1>(that: Map<K1, V1>): Map<[K, K1], [V, V1]> {
    return this.cartesianProductWith(that, (v, v1) => {
      const pair: [V, V1] = [v, v1];
      return pair;
    })
  }

  zipWith<V1, V2>(that: Map<K, V1>, f: (v: V, v1: V1) => V2): Map<K, V2> {
    return new Map$zipWith(this, that, f);
  }

  zip<V1>(that: Map<K, V1>): Map<K, [V, V1]> {
    return this.zipWith(that, (v, v1) => {
      const pair: [V, V1] = [v, v1];
      return pair;
    })
  }

  //region HIGHER-ORDER FUNCS

  map<V1>(f: (v1: V) => V1): Map<K, V1> {
    return new Map$map<K, V, V1>(this, f);
  }

  filterKey(p: (k: K) => boolean): Map<K, V> {
    return  new Map$filterKey(this, p);
  }

  //endregion

  toString() {
    return this.pairs().map(p => `${p[0]} -> ${p[1]}`).toString();
  }

}


class Map$filterKey<K, V> extends Map<K, V> {
  _m: Map<K, V>;
  p: (k: K) => boolean;
  constructor(map: Map<K, V>, p: (k: K) => boolean) {
    super();
    this._m = map;
    this.p = p;
  }
  get(k: K): V {
    if (!this.p(k)) throw new Error('Key not found!');
    return this._m.get(k);
  }
  keySet(): Set<K> {
    return this._m.keySet().filter(this.p);
  }
}


class Map$map<K, V1, V2> extends Map<K, V2> {
  _m: Map<K, V1>;
  f: (v1: V1) => V2;
  constructor(map: Map<K, V1>, f: (v1: V1) => V2) {
    super();
    this._m = map;
    this.f = f;
  }
  get(k: K): V2 {
    return this.f(this._m.get(k));
  }
  keySet(): Set<K> {
    return this._m.keySet();
  }
  size(): number {
    return this._m.size();
  }
  pairs(): Iterable<[K, V2]> {
    return this._m.pairs().map(p => {
      const pair: [K, V2] = [p[0], this.f(p[1])];
      return pair;
    })
  }
}

class Map$cartesianProductWith<K1, K2, V1, V2, V> extends Map<[K1, K2], V> {
  map1: Map<K1, V1>; 
  map2: Map<K2, V2>;
  f: (v1: V1, v2: V2) => V;
  constructor(map1: Map<K1, V1>, map2: Map<K2, V2>, f: (v1: V1, v2: V2) => V) {
    super();
    this.map1 = map1;
    this.map2 = map2;
    this.f = f;
  }
  get(k: [K1, K2]): V {
    const k1 = k[0];
    const k2 = k[1];
    const pair: [V1, V2] = [this.map1.get(k1), this.map2.get(k2)];
    return this.f(pair[0], pair[1]);
  }
  keySet(): Set<[K1, K2]> {
    return this.map1.keySet().cartesianProduct(this.map2.keySet());
  }
  pairs(): Iterable<[[K1, K2], V]> {
    return this.map1.pairs().flatMap(p1 =>
      this.map2.pairs().map(p2 => {
        const res: [[K1, K2], V] = [[p1[0], p2[0]], this.f(p1[1], p2[1])];
        return res;
      })
    )
  }
  size(): number {
    return this.map1.keySet().size() * this.map2.keySet().size();
  }
}


class Map$zipWith<K, V1, V2, V> extends Map<K, V>{
  map1: Map<K, V1>;
  map2: Map<K, V2>;
  f: (v1: V1, v2: V2) => V;
  constructor(map1: Map<K, V1>, map2: Map<K, V2>, f: (v1: V1, v2: V2) => V) {
    super();
    this.map1 = map1;
    this.map2 = map2;
    this.f = f;
  }
  get(k: K): V {
    return this.f(this.map1.get(k), this.map2.get(k));
  }
  keySet(): Set<K> {
    return this.map1.keySet().intersect(this.map2.keySet());
  }
}
