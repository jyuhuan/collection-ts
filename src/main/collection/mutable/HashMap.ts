import { ClosedAddressHashTable } from '../base/ClosedAddressHashTable';
import { Set } from '../Set';
import { Eq, DefaultJavaScriptEq } from '../strategy/Eq';
import { Iterable } from '../Iterable';
import { Hash, DefaultJavaScriptHash } from '../strategy/Hash';
import { KeyMutableMap } from './KeyMutableMap';

export class HashMap<K, V> extends KeyMutableMap<K, V> {

  tbl: ClosedAddressHashTable<K, V>;

  constructor(tbl: ClosedAddressHashTable<K, V>) {
    super();
    this.tbl = tbl;
  }

  keyEq(): Eq<K> {
    return this.tbl.keyEq;
  }

  get(k: K): V {
    return this.tbl.get(k);
  }

  keySet(): Set<K> {
    return new HashMapKeySet(this);
  }

  add(k: K, v: V): void {
    this.tbl.add(k, v);
  }

  remove(k: K): void {
    this.tbl.remove(k);
  }

  clear(): void {
    this.tbl.clear();
  }

  set(k: K, v: V): void {
    this.tbl.add(k, v);
  }




  static empty<K, V>(): HashMap<K, V> {
    const tbl = ClosedAddressHashTable.empty<K, V>();
    return new HashMap(tbl);
  }

  static emptyUnder<K, V>(keyEq: Eq<K>, keyHash: Hash<K>): HashMap<K, V> {
    const tbl = ClosedAddressHashTable.emptyUnder<K, V>(keyEq, keyHash);
    return new HashMap(tbl);
  }

  static from<K, V>(...pairs: [K, V][]): HashMap<K, V> {
    const tbl = ClosedAddressHashTable.from<K, V>(...pairs);
    return new HashMap(tbl);
  }

  static fromUnder<K, V>(keyEq: Eq<K>, keyHash: Hash<K>, ...pairs: [K, V][]): HashMap<K, V> {
    const tbl = ClosedAddressHashTable.fromUnder<K, V>(keyEq, keyHash, ...pairs);
    return new HashMap(tbl);
  }

}

class HashMapKeySet<K, V> extends Set<K> {

  m: HashMap<K, V>;

  constructor(m: HashMap<K, V>) {
    super();
    this.m = m;
  }

  keyEq(): Eq<K> {
    return this.m.keyEq();
  }
  has(k: K): boolean {
    return this.m.tbl.locateEntryFor(k) != null;
  }
  keys(): Iterable<K> {
    return this.m.tbl.entires().map(e => e.key);
  }

}