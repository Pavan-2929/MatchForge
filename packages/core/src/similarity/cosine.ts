import type { QGramOptions } from "../types/similarity.js";

function generateQGramFrequencies(
  value: string,
  q: number,
): Map<string, number> {
  const characters = Array.from(value);
  const frequencies = new Map<string, number>();

  for (let i = 0; i <= characters.length - q; i++) {
    const gram = characters.slice(i, i + q).join("");

    frequencies.set(gram, (frequencies.get(gram) ?? 0) + 1);
  }

  return frequencies;
}

export function cosineSimilarity(
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

  const aFrequencies = generateQGramFrequencies(a, q);
  const bFrequencies = generateQGramFrequencies(b, q);

  if (aFrequencies.size === 0 || bFrequencies.size === 0) {
    return 0;
  }

  let dotProduct = 0;
  let aMagnitudeSquared = 0;
  let bMagnitudeSquared = 0;

  for (const [gram, frequency] of aFrequencies) {
    dotProduct += frequency * (bFrequencies.get(gram) ?? 0);
    aMagnitudeSquared += frequency ** 2;
  }

  for (const frequency of bFrequencies.values()) {
    bMagnitudeSquared += frequency ** 2;
  }

  const denominator =
    Math.sqrt(aMagnitudeSquared) * Math.sqrt(bMagnitudeSquared);

  return dotProduct / denominator;
}
