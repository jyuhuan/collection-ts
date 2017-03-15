/**
 * Represents a weak order, which is a relaxation of a total order by allowing ties.
 * 
 * Any implementation of this interface should obey the order laws:
 * 
 * - TODO:
 * 
 * @version 0.0.0
 * @since 0.0.0
 */
export abstract class Ord<X> {
  abstract compare(x1: X, x2: X): number;

  le(a: X, b: X): boolean { return this.compare(a, b) <= 0; }
  ge(a: X, b: X): boolean { return this.compare(a, b) >= 0; }
  lt(a: X, b: X): boolean { return this.compare(a, b) < 0; }
  gt(a: X, b: X): boolean { return this.compare(a, b) > 0; }
  eq(a: X, b: X): boolean { return this.compare(a, b) === 0; }
  ne(a: X, b: X): boolean { return this.compare(a, b) !== 0; }

  max(a: X, b: X): X {
    return this.ge(a, b) ? a : b;
  }

  min(a: X, b: X): X {
    return this.lt(a, b) ? a : b;
  }
  
  reversed(): Ord<X> {
    return new Ord$reversed(this);
  }

}

export class DefaultNumberOrd extends Ord<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}

class Ord$reversed<X> extends Ord<X> {
  ox: Ord<X>;
  constructor(ox: Ord<X>) {
    super();
    this.ox = ox;
  }
  reversed() {
    return this.ox;
  }
  compare(x1: X, x2: X): number {
    return -this.ox.compare(x1, x2);
  }
}
