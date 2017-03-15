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

}