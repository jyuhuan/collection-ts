import { ClosedAddressHashTable } from '../main/collection/base/ClosedAddressHashTable';
import { Eq } from '../main/collection/Eq';

const stringEq = { eq: (s1, s2) => s1 === s2 }
const stringHash1 = {
  //http://stackoverflow.com/a/7616484/2770243
  hashCode: (s: string) => { 
    var hash = 0, i, chr, len;
    if (s.length === 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
      chr   = s.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}

const stringHash2 = {
  hashCode: (s: string) => {
    return s.length;
  }
}

const tbl = new ClosedAddressHashTable<string, number>(stringEq, stringHash2, 5, 1.0);

tbl.add('alice', 5);
tbl.add('bob', 3);
tbl.add('cathy', 5);
tbl.add('daniel', 6);
tbl.add('emilia', 6);
tbl.add('frank', 5);
tbl.add('gina', 4);
tbl.add('howard', 6);
tbl.add('jacqueline', 10);
tbl.add('kevin', 5);
tbl.add('lisa', 4);
tbl.add('michael', 7);
tbl.add('nancy', 5);
tbl.add('oliver', 6);

tbl.remove('alice');
tbl.remove('bob');
tbl.remove('cathy');
tbl.remove('daniel');
tbl.remove('emilia');
tbl.remove('frank');
tbl.remove('gina');
tbl.remove('howard');
tbl.remove('jacqueline');
tbl.remove('kevin');
tbl.remove('lisa');
tbl.remove('michael');
tbl.remove('nancy');
tbl.remove('oliver');

tbl.add('alice', 5);
tbl.add('bob', 3);
tbl.add('cathy', 5);
tbl.add('daniel', 6);
tbl.add('emilia', 6);
tbl.add('frank', 5);
tbl.add('gina', 4);
tbl.add('howard', 6);
tbl.add('jacqueline', 10);
tbl.add('kevin', 5);
tbl.add('lisa', 4);
tbl.add('michael', 7);
tbl.add('nancy', 5);
tbl.add('oliver', 6);

tbl.remove('alice');
tbl.remove('bob');
tbl.remove('cathy');
tbl.remove('daniel');
tbl.remove('emilia');
tbl.remove('frank');
tbl.remove('gina');
tbl.remove('howard');
tbl.remove('jacqueline');
tbl.remove('kevin');
tbl.remove('lisa');
tbl.remove('michael');
tbl.remove('nancy');
tbl.remove('oliver');

tbl.add('alice', 5);
tbl.add('bob', 3);
tbl.add('cathy', 5);
tbl.add('daniel', 6);
tbl.add('emilia', 6);
tbl.add('frank', 5);
tbl.add('gina', 4);
tbl.add('howard', 6);
tbl.add('jacqueline', 10);
tbl.add('kevin', 5);
tbl.add('lisa', 4);
tbl.add('michael', 7);
tbl.add('nancy', 5);
tbl.add('oliver', 6);

for (const e of tbl.entires()) {
  console.log(e.key);
}

tbl.get('jacqueline')

const bp = 0;
