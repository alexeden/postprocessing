/**
 * Prefixes substrings within the given strings.
 *
 * @param prefix - A prefix.
 * @param substrings - The substrings.
 * @param strings - A collection of named strings.
 */
export const prefixSubstrings = (prefix: string, substrings: string[], strings: Map<string, string>) => {
  let prefixed;
  let regExp;

  for (const substring of substrings) {
    // tslint:disable-next-line:prefer-template
    prefixed = '$1' + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
    // tslint:disable-next-line:prefer-template
    regExp = new RegExp('([^\\.])(\\b' + substring + '\\b)', 'g');

    for (const entry of strings.entries()) {
      if (entry[1] !== null) {
        strings.set(entry[0], entry[1].replace(regExp, prefixed));
      }
    }
  }
};
