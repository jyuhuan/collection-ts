import { Builder } from '../builder/Builder';

export class StringBuilder extends Builder<any, string> {

  strings: Array<string>;
  constructor() {
    super();
    this.strings = new Array<string>();
  }

  append(x: any): void {
    this.strings.push(`${x}`);
  }

  clear(): void {
    this.strings = null;
    this.strings = new Array<string>();
  }

  toString(): string {
    return this.strings.join('');
  }

  result(): string { 
    return this.toString(); 
  }

  sizeHint(size: number): void {
    // do nothing
  }

  add(x: any): void {
    this.append(x);
  }

}