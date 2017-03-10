import { Eq } from '../Eq';
import { LinkedList, LinkedNode } from '../base/LinkedList';
import { KeyMutableMap } from './KeyMutableMap';
import { Set } from '../Set';

class MutableKeyValuePair<K, V> {
  key: K; 
  val: V;
  constructor(key: K, val: V) {
    this.key = key;
    this.val = val;
  }
}

export class ListMap<K, V> extends KeyMutableMap<K, V> {

  keyEq: Eq<K>; 
  lst: LinkedList<MutableKeyValuePair<K, V>>;

  constructor(keyEq: Eq<K>, lst: LinkedList<MutableKeyValuePair<K, V>>) {
    super();
    throw new Error('Method not implemented.');
  }

  locateKey(k: K): [LinkedNode<MutableKeyValuePair<K, V>>, LinkedNode<MutableKeyValuePair<K, V>>] {
    throw new Error('Method not implemented.');
  }

  add(k: K, v: V): void {
    throw new Error('Method not implemented.');
  }

  remove(k: K): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  set(k: K, v: V): void {
    throw new Error('Method not implemented.');
  }

  get(k: K): V {
    throw new Error('Method not implemented.');
  }

  keySet(): Set<K> {
    throw new Error('Method not implemented.');
  }


  static emptyUnder<K, V>(keyEq: Eq<K>): ListMap<K, V> {
    const lst = LinkedList.empty<MutableKeyValuePair<K, V>>();
    return new ListMap<K, V>(keyEq, lst);
  }

}
