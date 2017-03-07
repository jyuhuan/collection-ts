export class ExpandableArray<T> {
  data: Array<T>

  constructor(initialCapacity: number) {
    this.data = new Array<T>(initialCapacity);
  }

  at(idx: number) {
    return this.data[idx];
  }

  set(idx: number, newValue: T): void {
    this.data[idx] = newValue;
  }

  length() {
    return this.data.length;
  }


  //

  static ofInitialCapacity<T>(initialCapacity: number): ExpandableArray<T> {
    return new ExpandableArray<T>(initialCapacity);
  }

  static apply<T>(): ExpandableArray<T> {
    return ExpandableArray.ofInitialCapacity<T>(10);
  }

  static from<T>(...ts: T[]): ExpandableArray<T> {
    const arr = ExpandableArray.ofInitialCapacity<T>(ts.length);
    for (let i = 0; i < ts.length; i++) arr.set(i, ts[i]);
    return arr;
  }

}