import * as mut from '../main/collection/mutable'
import { Eq } from '../main/collection/Eq'

const eq: Eq<string> = new class {
  eq(s1: string, s2: string): boolean {
    return s1 === s2;
  }
}

const arr = mut.ArraySeq.tabulate(10, i => `Item ${i}`)
const idx = arr.indexOf("Item 3")
const rev = arr.reversed();

// Create a mutable array using a varargs parameter list.
const xs = mut.ArraySeq.from("a", "ab", "abc", "abcd");

xs.append("abcdef")
xs.insert(4, "abcde")

// JavaScript for..of support
for (const x of xs) {
  console.log(x);
}

// Higher-order functions. 
// This line won't be executed until the elements in ys are queried.
const ys = xs.map(x => x.length)

for (const y of ys) {
  // The actual computation in the map function happens here.
  console.log(y)
}

const zs = xs.concat(ys);

console.log(zs.toString());

const bp = 0;

