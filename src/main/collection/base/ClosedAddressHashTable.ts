import { Eq } from '../Eq';
import { Hash } from '../../Hash';
import { nextPowerOfTwo } from './Util';

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
   * the number of slots used so far.
   */
  numSlotsUsed: number;

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
    this.numSlotsUsed = 0;
    this.size = 0;
  }

  capacity(): number { return this.slots.length; }

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
    return this.numSlotsUsed >= Math.floor(this.slots.length * this.loadFactor);
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

  /**
   * Adds a given key value pair into the hash map. 
   */
  add(k: K, v: V): void {
    const idx = this.indexOf(k, this.capacity());
    if (this.slots[idx] == null) {
      // The slot for this hash code is empty
      if (this.shouldExpand()) this.expand();
      this.slots[idx] = new Entry(k, v);
      this.numSlotsUsed += 1;
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
        if (dummy.next == null) this.numSlotsUsed -= 1;
        this.size -= 1;
        return;
      }
      p = n;
      n = n.next;
    }
    // The key is not there.
    return ;
  }

  get(k: K): V {
    return null;
  }

  

}