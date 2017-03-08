import { LinkedList } from '../main/collection/base/LinkedList';

const l = new LinkedList<string>();
l.append("a")
l.append("b")
l.append("c")
l.append("d")
l.append("e")

const n = l.nodeAt(-1);

l.reverse();
l.reverseSublist(0, 5);

const bp = 0;
