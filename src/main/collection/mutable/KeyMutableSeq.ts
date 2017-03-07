import { ValueMutableSeq } from './ValueMutableSeq';

export abstract class KeyMutableSeq<X> extends ValueMutableSeq<X> {
  abstract prepend(x: X): void;
  abstract append(x: X): void;
  abstract clear(): void;
  abstract insert(idx: number, x: X): void;
}