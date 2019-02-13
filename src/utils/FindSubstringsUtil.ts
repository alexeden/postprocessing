/**
 * Finds and collects substrings that match the given regular expression.
 *
 * @param regExp - A regular expression.
 * @param string - A string.
 * @return The matching substrings.
 */
export const findSubstrings = (regExp: RegExp, str: string): string[] => {
  const substrings = [];
  let result;

  // tslint:disable-next-line:no-conditional-assignment
  while ((result = regExp.exec(str)) !== null) {
    substrings.push(result[1]);
  }

  return substrings;
}
