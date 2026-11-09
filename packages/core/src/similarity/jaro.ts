export function jaroSimilarity(a: string, b: string): number {
  const aChars = Array.from(a);
  const bChars = Array.from(b);

  const aLength = aChars.length;
  const bLength = bChars.length;

  if (a === b) {
    return 1;
  }

  if (aLength === 0 || bLength === 0) {
    return 0;
  }

  const matchDistance = Math.max(
    Math.floor(Math.max(aLength, bLength) / 2) - 1,
    0,
  );

  const aMatches = new Array<boolean>(aLength).fill(false);
  const bMatches = new Array<boolean>(bLength).fill(false);

  let matches = 0;

  // Find matching characters within the allowed window.
  for (let i = 0; i < aLength; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, bLength);

    for (let j = start; j < end; j++) {
      if (bMatches[j] || aChars[i] !== bChars[j]) {
        continue;
      }

      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) {
    return 0;
  }

  // Count matching characters that appear in a different order.
  const matchedA = aChars.filter((_, i) => aMatches[i]);
  const matchedB = bChars.filter((_, i) => bMatches[i]);

  let mismatches = 0;

  for (let i = 0; i < matches; i++) {
    if (matchedA[i] !== matchedB[i]) {
      mismatches++;
    }
  }

  const transpositions = mismatches / 2;

  return (
    (matches / aLength +
      matches / bLength +
      (matches - transpositions) / matches) /
    3
  );
}

export function jaroWinklerSimilarity(a: string, b: string): number {
  const jaroScore = jaroSimilarity(a, b);

  if (jaroScore <= 0.7) {
    return jaroScore;
  }

  const aChars = Array.from(a);
  const bChars = Array.from(b);

  let prefixLength = 0;
  const maxPrefixLength = 4;

  while (
    prefixLength < Math.min(aChars.length, bChars.length, maxPrefixLength) &&
    aChars[prefixLength] === bChars[prefixLength]
  ) {
    prefixLength++;
  }

  const scalingFactor = 0.1;

  return jaroScore + prefixLength * scalingFactor * (1 - jaroScore);
}   