// export abstract class Option<T> {
//   abstract get(): T;
// }

// export class Some<T> extends Option<T> {
//   t: T;

//   constructor(t: T) {
//     super();
//     this.t = t;
//   }

//   get(): T {
//     return this.t;
//   }
// }

// export class None<T> extends Option<T> {
//   get(): T {
//     throw new Error('Cannot call get on None.');
//   }
// }