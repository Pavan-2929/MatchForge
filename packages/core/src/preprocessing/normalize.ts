import type { NormalizeOptions } from "../types/preprocessing.js";

export function normalizeString(
  value: string,
  options: NormalizeOptions = {},
): string {
  const {
    lowercase = true,
    trim = true,
    removePunctuation = false,
    removeAccents = false,
    normalizeWhitespace = true,
  } = options;

  let result = value;

  if (trim) {
    result = result.trim();
  }

  if (normalizeWhitespace) {
    result = result.replace(/\s+/g, " ");
  }

  if (removeAccents) {
    result = result.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  if (removePunctuation) {
    result = result.replace(/\p{P}/gu, "");
  }

  if (lowercase) {
    result = result.toLowerCase();
  }

  return result;
}
