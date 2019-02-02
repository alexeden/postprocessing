/**
 * Prefixes substrings within the given strings.
 *
 * @param prefix - A prefix.
 * @param substrings - The substrings.
 * @param strings - A collection of named strings.
 */
export function prefixSubstrings(prefix: string, substrings: string[], strings: Map<string, string>) {
  let prefixed, regExp;

  for (const substring of substrings) {
    prefixed = '$1' + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
    regExp = new RegExp('([^\\.])(\\b' + substring + '\\b)', 'g');

    for (const entry of strings.entries()) {
      if (entry[1] !== null) {
        strings.set(entry[0], entry[1].replace(regExp, prefixed));
      }
    }
  }
}
