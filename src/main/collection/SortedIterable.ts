import { Iterable } from './Iterable';
import { Ord } from './Ord';

export abstract class SortedIterable<X> extends Iterable<X> {

  abstract order: Ord<X>;

}