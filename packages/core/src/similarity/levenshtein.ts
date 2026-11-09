export function levenshteinDistance(a: string, b: string): number {
  const aChars = Array.from(a);
  const bChars = Array.from(b);

  // Identical strings require zero edits.
  if (a === b) {
    return 0;
  }

  // An empty string requires one insertion or deletion per character.
  if (aChars.length === 0) {
    return bChars.length;
  }

  if (bChars.length === 0) {
    return aChars.length;
  }

  // Keep the shorter string in the columns to save memory.
  let source = aChars;
  let target = bChars;

  if (target.length > source.length) {
    [source, target] = [target, source];
  }

  let previousRow = Array.from(
    { length: target.length + 1 },
    (_, index) => index,
  );

  for (let i = 1; i <= source.length; i++) {
    const currentRow = new Array<number>(target.length + 1);

    currentRow[0] = i;

    for (let j = 1; j <= target.length; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      const insertion = currentRow[j - 1] + 1;
      const deletion = previousRow[j] + 1;
      const substitution = previousRow[j - 1] + cost;

      currentRow[j] = Math.min(insertion, deletion, substitution);
    }

    previousRow = currentRow;
  }

  return previousRow[target.length];
}

export function levenshteinSimilarity(a: string, b: string): number {
  const maxLength = Math.max(Array.from(a).length, Array.from(b).length);

  if (maxLength === 0) {
    return 1;
  }

  const distance = levenshteinDistance(a, b);

  return 1 - distance / maxLength;
}
