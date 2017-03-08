export function assert(condition: boolean): void {
  if (!condition) throw new Error("Assertion failed! ");
}

export function assertWith(condition: boolean, msg: string): void {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}