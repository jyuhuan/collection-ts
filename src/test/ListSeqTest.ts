import { ListSeq } from '../main/collection/immutable/ListSeq';

const l = ListSeq.from("a", "b", "c");

for (const str of l) {
  console.log(str)
}

const str = l.filter(x => x === 'b').toString();

const bp = 0;
