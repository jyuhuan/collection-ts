import { Iterable } from './Iterable';
import { Ord } from './strategy/Ord';

export abstract class SortedIterable<X> extends Iterable<X> {

  abstract order: Ord<X>;

}