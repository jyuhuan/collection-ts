import { ExpandableArray } from '../main/collection/base/ExpandableArray';
import { assert } from './Assert';

const arr1 = new ExpandableArray<string>(10, 0.7);
arr1.add('alice');
arr1.add('bob');
arr1.add('cathy');
arr1.add('daniel');
arr1.add('emilia');
// arr1.add('frank');
// arr1.add('gabriella');
// arr1.add('howard');
// arr1.add('idina');
// arr1.add('jack');

const arr2 = ExpandableArray.from("alice", "bob", "cathy", "daniel", "emilia");

const bp = 0;
