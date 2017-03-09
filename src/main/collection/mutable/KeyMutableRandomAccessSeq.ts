import { ValueMutableRandomAccessSeq } from "./ValueMutableRandomAccessSeq";

// Had to copy code from ValueMutableSeq, because TypeScript doesn't allow multiple inheritance.
export abstract class KeyMutableRandomAccessSeq<X> extends ValueMutableRandomAccessSeq<X> {
  abstract prepend(x: X): void;
  abstract append(x: X): void;
  abstract clear(): void;
  abstract insert(idx: number, x: X): void;
}