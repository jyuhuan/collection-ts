export function nextPowerOfTwo(x: number) {
  let y = x;
  y |= y >>> 1;
  y |= y >>> 2;
  y |= y >>> 4;
  y |= y >>> 8;
  y |= y >>> 16;
  return y + 1;
}
