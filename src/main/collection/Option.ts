export abstract class Option<T> {
  abstract get(): T;
}

export class Some<T> extends Option<T> {
  t: T;

  constructor(t: T) {
    super();
    this.t = t;
  }

  get(): T {
    return this.t;
  }

  static of<T>(t: T): Some<T> {
    return new Some(t);
  }
}

/**
 * This is perfectly assignable to Option<T> for any T, 
 * not because TypeScript has covariance suppor, but because
 * TypesScript doesn't check the variance at all. 
 */
export class None extends Option<never> {
  get(): never {
    throw new Error('Cannot call get on None.');
  }
}
