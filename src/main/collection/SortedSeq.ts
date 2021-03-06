import { Ord } from './strategy/Ord';
import { Seq } from './Seq';

export abstract class SortedSeq<X> extends Seq<X> {

  abstract order: Ord<X>;

}