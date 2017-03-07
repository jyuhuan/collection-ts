import * as base from '../main/collection/base';

const arr = base.ExpandableArray.ofInitialCapacityAndLoadFactor<string>(16, 1.0);
for (let i = 0; i < 22; i++) {
  arr.add(`Item ${i}`)
}

const size = arr.size;


for (let i = 0; i < arr.data.length; i++) {
  console.log(`Item at ${i}: ${arr.data[i]}`)
}

const bp = 0;
