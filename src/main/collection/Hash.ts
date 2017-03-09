export interface Hash<X> {
  hashCode(x: X): number;
}

export class DefaultJavaScriptHash<X> implements Hash<X> {
  hashCode(x: X) {
    const str = x.toString();
    return StringHash.hashCode(str);
  }
}

export const StringHash = {
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
