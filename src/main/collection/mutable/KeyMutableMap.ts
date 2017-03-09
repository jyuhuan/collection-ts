import { ValueMutableMap } from "./ValueMutableMap";

export abstract class KeyMutableMap<K, V> extends ValueMutableMap<K, V> {
  abstract add(k: K, v: V): void;
  abstract remove(k: K): void;
  abstract clear(): void;
}