import { ArraySeq } from '../main/collection/mutable/ArraySeq';
import { HashMap } from '../main/collection/mutable/HashMap';
import { StringHash } from '../main/collection/Hash';
import { HashSet } from '../main/collection/mutable/HashSet';


function arrayDemo() {
  console.log('ARRAY DEMO {');

  // Create an ArraySeq out of elements
  const xs = ArraySeq.from('alice', 'bob', 'catherine', 'daniel', 'emilia', 'frank'); 
  console.log(` - xs = ${xs}`);

  // Filter the elements by a predicate
  const shorterThanSix = xs.filter(s => s.length < 6);

  // Map the elements by length
  const lengths = xs.map(s => s.length);

  // FlatMap
  const letters = xs.flatMap(x => ArraySeq.from(...x.split('')));
  
  // None of the three lines above will be executed, until now:
  console.log(` - shorterThanSix = ${shorterThanSix}`);
  console.log(` - lengths = ${lengths}`);
  console.log(` - letters = ${letters}`);

  // Chaining up the higher-order functions
  const ys = xs.filter(s => s.length < 6).map(s => "hello, " + s).flatMap(x => ArraySeq.from(...x.split('')));
  console.log(` - ys = ${ys}`);

  // Operations between two sequences
  const zipped = xs.zip(lengths);
  console.log(` - zipped = ${zipped}`)

  // Operations on one sequence
  const totalLength = lengths.foldLeft(0, (a, b) => a + b);
  console.log(` - totalLength = ${totalLength}`);

  console.log('}\n')
}

function mapDemo() {
  console.log('MAP DEMO {');
  
  // Create a hash map out of key-value pairs
  const map1 = HashMap.from(
    ['alice', 5],
    ['bob', 3],
    ['cathy', 5],
    ['daniel', 6],
    ['emilia', 6],
    ['frank', 5],
    ['gina', 4],
    ['howard', 6]
  );
  console.log(` - map1 = ${map1.toString()}`);

  // Filter the keys of the map (keys, together with the value they are associated with, will be filtered out)
  const map1ShorterThanSix = map1.filterKey(s => s.length < 6);

  // Map the values by multiplying them by 100
  const map1Enlarged = map1.map(n => n * 100);

  // None of the three lines above will be executed, until now:
  console.log(` - map1ShorterThanSix = ${map1ShorterThanSix}`);
  console.log(` - map1Enlarged = ${map1Enlarged}`);


  // Any type can be used as key in Maps. For example:
  class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
    toString() { return `${this.name}(${this.age})` }
  }

  // Defining a hash map with customized equality and hashing strategies.
  const map2 = HashMap.fromUnder(
    { eq: (a: Person, b: Person) => a.name == b.name && a.age == b.age },
    { hashCode: (p: Person) => StringHash.hashCode(p.name) + p.age * 37 },
    [new Person('alice', 1), true],
    [new Person('bob', 1), false],
    [new Person('cathy', 1), true],
    [new Person('daniel', 1), false]
  )
  console.log(` - map2 = ${map2}`);


  // Mapping the values of a map
  const map3 = map2.map(b => b ? 1 : -1);

  // Zipping two maps, where pairs with the same key are merged. 
  const zipped = map2.zip(map3);

  // Once again, none of the two lines above will be executed, until now:
  console.log(` - map3 = ${map3}`);
  console.log(` - zipped = ${zipped}`);

  // Cartesian product of two maps
  const cartProd = map1.cartesianProduct(map2);
  console.log(` - cartProd = ${cartProd}`);

  console.log('}\n')
}

function setDemo() {
  console.log('SET DEMO {');

  // Creating a set out of elements
  const set1 = HashSet.from('alice', 'bob', 'catherine', 'daniel', 'emilia', 'frank');
  console.log(` - set1 = ${set1}`)

  // Filter set elements
  const shorterThanSix = set1.filter(x => x.length < 6);

  // Again,the line above will not be executed, until now:
  console.log(` - shorterThanSix = ${shorterThanSix}`);

  // Cartesian product
  const set2 = HashSet.from(true, false);
  console.log(` - set2 = ${set2}`)
  const cartProd = set1.cartesianProduct(set2);

  // Set operations: union and intersect
  const set3 = HashSet.from('daniel', 'emilia', 'frank', 'gina', 'howard', 'ian');
  console.log(` - set3 = ${set3}`)
  const union = set1.union(set3);
  const intersect = set1.intersect(set3);

  console.log(` - cartProd (set1 ⨉ set3) = ${cartProd}`);
  console.log(` - union (set1 ⋃ set3) = ${union}`);
  console.log(` - intersect (set1 ⋂ set3) = ${intersect}`);

  console.log('}\n')
}


arrayDemo();
mapDemo();
setDemo();

const bp = 0;