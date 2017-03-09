import { Iterable } from '../Iterable';
export abstract class Builder<X, Y> {

  abstract sizeHint(size: number): void;

  abstract add(x: X): void;

  addAll(xs: Iterable<X>): void {
    for (const x of xs) this.add(x);
  }

  abstract result(): Y;

  map<Z>(f: (y: Y) => Z): Builder<X, Z> {
    return new MappedBuilder(this, f);
  }

  contraMap<Z>(f: (z: Z) => X): Builder<Z, Y> {
    return new ContramappedBuilder<X, Y, Z>(this, f);
  }
}


class MappedBuilder<X, Y, Z> extends Builder<X, Z> {

  b: Builder<X, Y>;
  f: (y: Y) => Z;
  constructor(b: Builder<X, Y>, f: (y: Y) => Z) {
    super();
    this.b = b;
    this.f = f;
  }

  sizeHint(size: number): void {
    this.b.sizeHint(size);
  }
  add(x: X): void {
    this.add(x);
  }
  result(): Z {
    return this.f(this.b.result());
  }

}


class ContramappedBuilder<X, Y, Z> extends Builder<Z, Y> {

  b: Builder<X, Y>;
  f: (z: Z) => X;
  constructor(b: Builder<X, Y>, f: (z: Z) => X) {
    super();
    this.b = b;
    this.f = f;
  }

  sizeHint(size: number): void {
    this.b.sizeHint(size);
  }
  add(z: Z): void {
    this.b.add(this.f(z));
  }
  result(): Y {
    return this.b.result();
  }

}