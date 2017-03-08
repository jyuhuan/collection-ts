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
export interface Ord<X> {
  compare(x1: X, x2: X): number
}