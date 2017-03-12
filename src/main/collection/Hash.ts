/**
 * Represents a hashing strategy. 
 * 
 * An implementation of this interface for type X answers the question: 
 * *how to hash an object of `X` into an integer?*
 * 
 * @version 0.0.0
 * @since 0.0.0
 */
export interface Hash<X> {
  /**
   * Computes the hash code of the given element.
   * 
   * @param x The item to hash. 
   */
  hashCode(x: X): number;
}

/**
 * A default hashing strategy based on JavaScript's built-in `Map`. 
 * 
 * JavaScript's `Map` uses the string representation. 
 * This hashing strategy mimics that by hashing over the string representation of the object. 
 * 
 * @version 0.0.0
 * @since 0.0.0
 */
export class DefaultJavaScriptHash<X> implements Hash<X> {
  hashCode(x: X) {
    const str = x.toString();
    return StringHash.hashCode(str);
  }
}

/**
 * A hashing strategy for strings. 
 * 
 * Copied from http://stackoverflow.com/a/7616484/2770243 with slight changes.
 * 
 * @version 0.0.0
 * @since 0.0.0
 */
export const StringHash = {
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
