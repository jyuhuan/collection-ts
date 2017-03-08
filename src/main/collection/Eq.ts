/**
 * Represents a strategy for determining the equivalence between two elements of some type.
 * 
 * Any implementation of this interface should obey the equivalence laws:
 * 
 *  - **Reflextivity**: _x_ = _x_
 *  - **Symmetry**: _x_ = _y_ ⇔ _y_ = _x_
 *  - **Transitivity**: _x_ = _y_ ∧ _y_ = _z_ ⇒ _x_ = _z_
 * 
 * @since 0.0.0
 * @version 0.0.0
 */
export interface Eq<X> {
  /**
   * Tests the equivalence between two elements. 
   */
  eq(x1: X, x2: X): boolean;
}