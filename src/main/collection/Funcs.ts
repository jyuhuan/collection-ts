// Inspired by: http://stackoverflow.com/a/36871498/2770243

export abstract class Func<I, O> extends Function {
  constructor(f: (i: I) => O) {
    super();
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}

export abstract class Func2<I1, I2, O> extends Function {
  constructor(f: (i1: I1, i2: I2) => O) {
    super();
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}

export abstract class Func3<I1, I2, I3, O> extends Function {
  constructor(f: (i1: I1, i2: I2, i3: I3) => O) {
    super();
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}
