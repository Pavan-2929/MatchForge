import type { QGramOptions } from "../types/similarity.js";

function generateQGrams(value: string, q: number): Set<string> {
  const characters = Array.from(value);
  const qGrams = new Set<string>();

  for (let i = 0; i <= characters.length - q; i++) {
    qGrams.add(characters.slice(i, i + q).join(""));
  }

  return qGrams;
}

export function jaccardSimilarity(
  a: string,
  b: string,
  options: QGramOptions = {},
): number {
  const { q = 2 } = options;

  if (!Number.isInteger(q) || q < 1) {
    throw new RangeError("q must be a positive integer");
  }

  if (a === b) {
    return 1;
  }

  const aGrams = generateQGrams(a, q);
  const bGrams = generateQGrams(b, q);

  if (aGrams.size === 0 || bGrams.size === 0) {
    return 0;
  }

  let intersectionSize = 0;

  for (const gram of aGrams) {
    if (bGrams.has(gram)) {
      intersectionSize++;
    }
  }

  const unionSize = new Set([...aGrams, ...bGrams]).size;

  return intersectionSize / unionSize;
}

export function diceSimilarity(
  a: string,
  b: string,
  options: QGramOptions = {},
): number {
  const { q = 2 } = options;

  if (!Number.isInteger(q) || q < 1) {
    throw new RangeError("q must be a positive integer");
  }

  if (a === b) {
    return 1;
  }

  const aGrams = generateQGrams(a, q);
  const bGrams = generateQGrams(b, q);

  if (aGrams.size === 0 || bGrams.size === 0) {
    return 0;
  }

  let intersectionSize = 0;

  for (const gram of aGrams) {
    if (bGrams.has(gram)) {
      intersectionSize++;
    }
  }

  return (2 * intersectionSize) / (aGrams.size + bGrams.size);
}
