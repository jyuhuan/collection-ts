import { Set } from '../Set';
import { Eq } from '../Eq';
import { Iterable } from '../Iterable';
import { ClosedAddressHashTable } from '../base/ClosedAddressHashTable';
import { KeyMutableSet } from './KeyMutableSet';

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

}