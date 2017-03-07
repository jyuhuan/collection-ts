import * as util from './Util';

export class ExpandableArray<T> {
  data: Array<T>;
  private _size: number;
  loadFactor: number;

  constructor(initialCapacity: number, loadFactor: number) {
    this.data = new Array<T>(initialCapacity);
    this._size = 0;
    this.loadFactor = loadFactor;
  }

  at(idx: number) {
    return this.data[idx];
  }

  get(idx: number) {
    return this.at(idx);
  }

  set(idx: number, newValue: T): void {
    this.data[idx] = newValue;
  }

  add(t: T): void {
    if (this.shouldExpand()) this.expand();
    this.data[this._size] = t;
    this._size += 1;
  }

  shouldExpand() {
    return this._size >= this.data.length * this.loadFactor
  }

  expand() {
    const newLength = util.nextPowerOfTwo(this.data.length)
    const newData = new Array<T>(newLength);
    for (let i = 0; i < this._size; i++) newData[i] = this.data[i];
    this.data = null;
    this.data = newData;
  }

  get size(): number {
    return this._size;
  }


  //

  static defaultCapacity = 16;
  static defaultLoadFactor = 0.7;

  static ofInitialCapacityAndLoadFactor<T>(initialCapacity: number, loadFactor: number): ExpandableArray<T> {
    return new ExpandableArray<T>(initialCapacity, loadFactor);
  }

  static apply<T>(): ExpandableArray<T> {
    return ExpandableArray.ofInitialCapacityAndLoadFactor<T>(
      ExpandableArray.defaultCapacity, 
      ExpandableArray.defaultLoadFactor
    );
  }

  static from<T>(...ts: T[]): ExpandableArray<T> {
    const arr = ExpandableArray.ofInitialCapacityAndLoadFactor<T>(ts.length, ExpandableArray.defaultLoadFactor);
    for (let i = 0; i < ts.length; i++) arr.set(i, ts[i]);
    return arr;
  }

}