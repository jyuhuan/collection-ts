import { HashMap } from '../main/collection/mutable/HashMap';

const map = HashMap.from(
  ['alice', 5],
  ['bob', 3],
  ['cathy', 5],
  ['daniel', 6],
  ['emilia', 6],
  ['frank', 5],
  ['gina', 4],
  ['howard', 6]
)

map.add('jacqueline', 10);
map.add('kevin', 5);
map.add('lisa', 4);
map.add('michael', 7);
map.add('nancy', 5);
map.add('oliver', 6);

map.remove('jacqueline');
map.remove('kevin');
map.remove('lisa');
map.remove('michael');
map.remove('nancy');
map.remove('oliver');

map.set('daniel', 10);

map.getOrElse('xxx', () => 123);

for (const pair of map.pairs()) {
  console.log(pair);
}

const danielVal = map('daniel')

const bp = 0;
