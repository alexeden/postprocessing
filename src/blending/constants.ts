/**
 * A blend function enumeration.
 */
export enum BlendFunction {
  /** No blending. The effect will not be included in the final shader. */
  SKIP = 0,
  /** Additive blending. Fast, but may produce washed out results. */
  ADD = 1,
  /** Alpha blending. Blends based on the alpha value of the new color. Opacity will be ignored. */
  ALPHA = 2,
  /** Average blending. */
  AVERAGE = 3,
  /** Color dodge. */
  COLOR_BURN = 4,
  /** Color burn. */
  COLOR_DODGE = 5,
  /** Prioritize darker colors. */
  DARKEN = 6,
  /** Color difference. */
  DIFFERENCE = 7,
  /** Color exclusion. */
  EXCLUSION = 8,
  /** Prioritize lighter colors. */
  LIGHTEN = 9,
  /** Color multiplication. */
  MULTIPLY = 10,
  /** Color division. */
  DIVIDE = 11,
  /** Color negation. */
  NEGATION = 12,
  /** Normal blending. The new color overwrites the old one. */
  NORMAL = 13,
  /** Color overlay. */
  OVERLAY = 14,
  /** Color reflection. */
  REFLECT = 15,
  /** Screen blending. The two colors are effectively projected on a white screen simultaneously. */
  SCREEN = 16,
  /** Soft light blending. */
  SOFT_LIGHT = 17,
  /** Color subtraction. */
  SUBTRACT = 18,
}
