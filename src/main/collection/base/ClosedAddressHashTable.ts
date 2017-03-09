import { Eq, DefaultJavaScriptEq } from '../Eq';
import { Hash, DefaultJavaScriptHash } from '../Hash';
import { nextPowerOfTwo } from './Util';
import { Iterable } from '../Iterable';
import { Iterator } from '../Iterator';

class Entry<K, V> {
  key: K;
  val: V;
  next: Entry<K, V>;

  constructor(key: K, val: V) {
    this.key = key;
    this.val = val;
    this.next = null;
  }

  toString(): string {
    return `(${this.key}, ${this.val})`;
  }
}

/**
 * Represents a hash table which handles collision by a linked list.
 * TODO: change linked list to a binary search tree. 
 */
export class ClosedAddressHashTable<K, V> {

  slots: Entry<K, V>[];

  keyEq: Eq<K>;
  keyHash: Hash<K>;

  loadFactor: number;

  /**
   * The number of entries in this hash table.
   */
  size: number;

  /**
   * Creates a new open-address hash table.
   * @param keyEq The equivalence definition of the key.
   * @param keyHash The hashing strategy of the key.
   * @param initialCapacity The initial capacity of the hash table.
   * @param loadFactor The loadFactor of the hash table.
   */
  constructor(keyEq: Eq<K>, keyHash: Hash<K>, initialCapacity: number, loadFactor: number) {
    this.keyEq = keyEq;
    this.keyHash = keyHash;
    this.slots = new Array<Entry<K, V>>(initialCapacity);
    this.loadFactor = loadFactor;
    this.size = 0;
  }

  capacity(): number { return this.slots.length; }

  entires(): Iterable<Entry<K, V>> {
    return new EntryIterable(this);
  }

  /**
   * The index of the given key in the internal array. 
   * This answers the question: *which slot does the key belong to?*
   * @param k The key whose index is to be found.
   */
  indexOf(k: K, totalNumSlots: number): number {
    const hash = this.keyHash.hashCode(k);
    const mod = hash % totalNumSlots;
    return mod < 0 ? mod + totalNumSlots : mod;
  }

  shouldExpand() {
    return this.size >= Math.floor(this.slots.length * this.loadFactor);
  }

  expand() {
    const newLength = nextPowerOfTwo(this.slots.length);
    const oldSlots = this.slots;
    const newSlots = new Array<Entry<K, V>>(newLength);
    // The line above creates a new array of `undefine`s, instead of `null`s,
    // resulting `null`s and `undefine`s to be mixed. This seems to be OK.

    let i = 0;
    while (i < oldSlots.length) {
      let cur = oldSlots[i];
      while (cur != null) {
        const newHash = this.indexOf(cur.key, newLength);
        const nextEntry = cur.next;
        cur.next = newSlots[newHash];
        newSlots[newHash] = cur;
        cur = nextEntry;
      }
      i += 1;
    }
    this.slots = newSlots;
  }

  locateEntryFor(k: K): Entry<K, V> {
    const idx = this.indexOf(k, this.capacity());
    let cur = this.slots[idx];
    while (cur != null && !this.keyEq.eq(cur.key, k)) {
      cur = cur.next;
    }
    return cur;
  }

  /**
   * Adds a given key value pair into the hash map. 
   */
  add(k: K, v: V): void {
    if (this.shouldExpand()) this.expand();
    const idx = this.indexOf(k, this.capacity());
    if (this.slots[idx] == null) {
      // The slot for this hash code is empty
      this.slots[idx] = new Entry(k, v);
    }
    else { 
      // Something is already in the slot
      // Try to find the target value `v`. 
      let cur = this.slots[idx];
      while (cur != null) {
        if (this.keyEq.eq(cur.key, k)) {
          cur.val = v;
          return;
        }
        cur = cur.next;
      }
      // The key is not present in the list. Prepend it.
      const entry = new Entry(k, v);
      entry.next = this.slots[idx];
      this.slots[idx] = entry;
    }
    this.size += 1;
  }

  remove(k: K): void {
    const idx = this.indexOf(k, this.capacity());
    const dummy = new Entry<K, V>(null, null);
    dummy.next = this.slots[idx];
    let p = dummy;
    let n = p.next;
    while (n != null) {
      if (this.keyEq.eq(n.key, k)) {
        // remove the key and finish
        p.next = n.next;
        this.slots[idx] = dummy.next;
        this.size -= 1;
        return;
      }
      p = n;
      n = n.next;
    }
    // The key is not there.
    return ;
  }

  clear(): void {
    for (let i = 0; i < this.slots.length; i++) this.slots[i] = null;
    this.size = 0;
  }

  get(k: K): V {
    const entry = this.locateEntryFor(k);
    return entry == null ? null : entry.val;
  }

  
  static defaultLoadFactor = 0.7;
  static defaultCapacity = 16;

  static empty<K, V>(): ClosedAddressHashTable<K, V> {
    return ClosedAddressHashTable.emptyUnder<K, V>(new DefaultJavaScriptEq(), new DefaultJavaScriptHash());
  }

  static emptyUnder<K, V>(keyEq: Eq<K>, keyHash: Hash<K>): ClosedAddressHashTable<K, V> {
    return new ClosedAddressHashTable<K, V>(keyEq, keyHash, ClosedAddressHashTable.defaultLoadFactor, ClosedAddressHashTable.defaultLoadFactor);
  }

  static from<K, V>(...pairs: [K, V][]): ClosedAddressHashTable<K, V> {
    return ClosedAddressHashTable.fromUnder<K, V>(new DefaultJavaScriptEq(), new DefaultJavaScriptHash(), ...pairs);
  }

  static fromUnder<K, V>(keyEq: Eq<K>, keyHash: Hash<K>, ...pairs: [K, V][]): ClosedAddressHashTable<K, V> {
    const tbl = new ClosedAddressHashTable<K, V>(keyEq, keyHash, pairs.length, ClosedAddressHashTable.defaultLoadFactor);
    for (const pair of pairs) tbl.add(pair[0], pair[1]);
    return tbl;
  }
  

}

class EntryIterator<K, V> implements Iterator<Entry<K, V>> {
  tbl: ClosedAddressHashTable<K, V>;
  idx: number;
  entry: Entry<K, V>;

  constructor(tbl: ClosedAddressHashTable<K, V>) {
    this.tbl = tbl;
    this.idx = -1;
    this.entry = null;
  }
  
  current(): Entry<K, V> {
    return this.entry;
  }
  
  advance(): boolean {
    if (this.entry != null && this.entry.next != null) {
      this.entry = this.entry.next;
      return true;
    }
    else {
      while (this.idx < this.tbl.slots.length) {
        this.idx += 1;
        if (this.tbl.slots[this.idx] != null) {
          this.entry = this.tbl.slots[this.idx];
          return true;
        }
      }
      return false;
    }
  }
}

class EntryIterable<K, V> extends Iterable<Entry<K, V>> {
  tbl: ClosedAddressHashTable<K, V>;
  constructor(tbl: ClosedAddressHashTable<K, V>) {
    super();
    this.tbl = tbl;
  }
  newIterator(): Iterator<Entry<K, V>> {
    return new EntryIterator(this.tbl);
  }
}
