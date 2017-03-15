import { Ord } from './strategy/Ord';
import { RandomAccessSeq } from './RandomAccessSeq';

export abstract class SortedRandomAccessSeq<X> extends RandomAccessSeq<X> {

  abstract order: Ord<X>;

}