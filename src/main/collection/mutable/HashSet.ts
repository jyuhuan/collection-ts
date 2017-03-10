import { Set } from '../Set';
import { Eq, DefaultJavaScriptEq } from '../Eq';
import { Iterable } from '../Iterable';
import { ClosedAddressHashTable } from '../base/ClosedAddressHashTable';
import { KeyMutableSet } from './KeyMutableSet';
import { Hash, DefaultJavaScriptHash } from '../Hash';

export class HashSet<K> extends KeyMutableSet<K> {
  tbl: ClosedAddressHashTable<K, any>;

  constructor(tbl: ClosedAddressHashTable<K, any>) {
    super();
    this.tbl = tbl;
  }

  keyEq(): Eq<K> {
    return this.keyEq();
  }

  has(k: K): boolean {
    return this.has(k);
  }

  keys(): Iterable<K> {
    return this.tbl.entires().map(e => e.key);
  }

  add(k: K): void {
    this.tbl.add(k, null);
  }

  remove(k: K): void {
    this.tbl.remove(k);
  }

  clear(): void {
    this.tbl.clear();
  }


  static from<X>(...elems: X[]): HashSet<X> {
    return HashSet.fromUnder<X>(new DefaultJavaScriptEq<X>(), new DefaultJavaScriptHash<X>(), ...elems);
  }

  static fromUnder<X>(eq: Eq<X>, hash: Hash<X>, ...elems: X[]): HashSet<X> {
    const tbl = ClosedAddressHashTable.emptyUnder<X, any>(eq, hash);
    for (const elem of elems) tbl.add(elem, null);
    return new HashSet(tbl);
  }


}