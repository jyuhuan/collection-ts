import { assertWith, assert } from './Assert';
import { ArraySeq } from '../main/collection/mutable/ArraySeq';


const ss = ArraySeq.from("bob", "christine", "daniel", "emily");

const ll = ss.map(s => s.length);

const indexFoundUnderEq = ss.indexOfUnder("christine", { eq: (a: string, b: string) => a === b });
const indexFoundUnderJSEquality = ss.indexOf("christine");

assertWith(indexFoundUnderEq === 1, "Array.indexOfUnder error")
assertWith(indexFoundUnderJSEquality === 1, "Array.indexOf error")

ss.prepend("alice");
ss.append("frank");

const headItemAfterPrepend = ss.get(0);
const lastItemAfterAppend = ss.get(ss.length() - 1);

assert(headItemAfterPrepend === "alice");
assert(lastItemAfterAppend === "frank");

const indexFoundUnderEqAfterPrepend = ss.indexOfUnder("christine", { eq: (a: string, b: string) => a === b });
const indexFoundUnderJSEqualityAfterPrepend = ss.indexOf("christine");

assertWith(indexFoundUnderEqAfterPrepend === 2, "Array.indexOfUnder error")
assertWith(indexFoundUnderJSEqualityAfterPrepend === 2, "Array.indexOf error")

const bp = 0;

const lengths = ss.map(s => s.length)
