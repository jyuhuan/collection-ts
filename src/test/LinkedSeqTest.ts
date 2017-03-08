import { LinkedSeq } from '../main/collection/mutable/LinkedSeq';

const l = LinkedSeq.from("a", "b", "c");

for (const str of l) {
  console.log(str)
}

const bp = 0;
