export class LinkedNode<X> {
  data: X;
  next: LinkedNode<X>;
  constructor(data: X, next: LinkedNode<X>) {
    this.data = data;
    this.next = next;
  }

  static ofLeaf<X>(data: X) {
    return new LinkedNode<X>(data, null);
  }

  static ofInternal<X>(data: X, next: LinkedNode<X>) {
    return new LinkedNode(data, next);
  }
}

export class LinkedList<X> {
  dummy: LinkedNode<X>;
  last: LinkedNode<X>;

  constructor() {
    this.dummy = LinkedNode.ofLeaf(null);
    this.last = this.dummy;
  }

  append(x: X) {
    this.last.next = LinkedNode.ofLeaf(x);
    this.last = this.last.next;
  }

  prepend(x: X) {
    this.dummy.next = LinkedNode.ofInternal(x, this.dummy.next);
  }

  clear() {
    this.dummy.next = null;
  }

  insert(idx: number, x: X): void {
    let p: LinkedNode<X> = this.dummy;
    let c: LinkedNode<X> = this.dummy.next;
    
    let i = 0;
    
    while (i < idx && c != null) {
      p = c;
      c = c.next;
      i += 1;
    }

    const newNode = LinkedNode.ofLeaf(x);

    p.next = newNode;
    newNode.next = c;
  }

  set(idx: number, x: X): void {
    this.nodeAt(idx).data = x;
  }
  
  nodeAt(idx: number): LinkedNode<X> {
    let i = 0;
    let cur = this.dummy.next;
    while (i < idx && cur != null) {
      cur = cur.next;
      i += 1;
    }
    return cur;
  }

  get(idx: number): X {
    return this.nodeAt(idx).data;
  }

  length(): number {
    let i = 0;
    let cur = this.dummy.next;
    while (cur != null) {
      cur = cur.next;
      i += 1;
    }
    return i;
  }


  static from<X>(...xs: X[]) {
    const l = new LinkedList<X>();
    for (const x of xs) l.append(x);
    return l;
  }

}




