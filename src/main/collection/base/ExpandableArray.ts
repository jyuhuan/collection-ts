import * as util from './Util';

export class ExpandableArray<X> {
  data: Array<X>;
  private _size: number;
  loadFactor: number;

  constructor(initialCapacity: number, loadFactor: number) {
    this.data = new Array<X>(initialCapacity);
    this._size = 0;
    this.loadFactor = loadFactor;
  }

  boundCheck(idx: number) {
    if (!(0 <= idx && idx < this._size)) throw new Error(`Index ${idx} is out of bounds!`)
  }

  at(idx: number) {
    this.boundCheck(idx);
    return this.data[idx];
  }

  get(idx: number) {
    return this.at(idx);
  }

  set(idx: number, x: X): void {
    this.boundCheck(idx);
    this.data[idx] = x;
  }

  add(x: X): void {
    if (this.shouldExpand()) this.expand();
    this.data[this._size] = x;
    this._size += 1;
  }

  shouldExpand() {
    return this._size >= this.data.length * this.loadFactor
  }

  expand() {
    const newLength = util.nextPowerOfTwo(this.data.length)
    const newData = new Array<X>(newLength);
    for (let i = 0; i < this._size; i++) newData[i] = this.data[i];
    this.data = null;
    this.data = newData;
  }

  get size(): number {
    return this._size;
  }

  get capacity(): number {
    return this.data.length;
  }

  insert(idx: number, x: X): void {
    if (this.shouldExpand()) this.expand();
    for (let i = this.size - 1; i >= idx; i--) this.data[i + 1] = this.data[i];
    this.data[idx] = x;
    this._size += 1;
  }

  prepend(x: X): void {
    this.insert(0, x);
  }

  append(x: X): void {
    if (this.shouldExpand()) this.expand();
    this.data[this.size] = x;
    this._size += 1;
  }

  reversed(): ExpandableArray<X> {
    const l = this.data.length;
    const newData = new Array<X>(l);
    for (let i = 0; i < this.size; i++) newData[l - i - 1] = this.data[i];
    return ExpandableArray.from(...newData);
  }

  reverse(): void {
    this.reverseSubarray(0, this.data.length);
  }

  reverseSubarray(start: number, end: number): void {
    let i = start;
    let j = end - 1;
    while (i < j) {
      this.swap(i, j);
    }
  }

  swap(i: number, j: number): void {
    const t = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = t;
  }

  clear(): void {
    this._size = 0;
  }

  //

  static defaultCapacity = 16;
  static defaultLoadFactor = 0.7;

  static ofInitialCapacityAndLoadFactor<X>(initialCapacity: number, loadFactor: number): ExpandableArray<X> {
    return new ExpandableArray<X>(initialCapacity, loadFactor);
  }

  static ofInitialCapacity<X>(initialCapacity: number): ExpandableArray<X> {
    return new ExpandableArray<X>(initialCapacity, ExpandableArray.defaultLoadFactor);
  }

  static apply<X>(): ExpandableArray<X> {
    return ExpandableArray.ofInitialCapacityAndLoadFactor<X>(
      ExpandableArray.defaultCapacity, 
      ExpandableArray.defaultLoadFactor
    );
  }

  static from<X>(...ts: X[]): ExpandableArray<X> {
    const arr = ExpandableArray.ofInitialCapacityAndLoadFactor<X>(ts.length, ExpandableArray.defaultLoadFactor);
    arr._size = ts.length;
    for (let i = 0; i < ts.length; i++) arr.set(i, ts[i]);
    return arr;
  }

  static fill<X>(numElems: number, value: () => X): ExpandableArray<X> {
    const arr = ExpandableArray.ofInitialCapacityAndLoadFactor<X>(numElems, ExpandableArray.defaultLoadFactor);
    arr._size = numElems;
    for (let i = 0; i < numElems; i++) arr.set(i, value());
    return arr;
  }

}