import * as tc from '../main/collection'
import * as mut from '../main/collection/mutable'

const xs = mut.ArraySeq.from("a", "ab", "abc", "abcd");

for (const x of xs) {
  console.log(x);
}

const ys = xs.map(x => x.length)

for (const y of ys) {
  console.log(y)
}

