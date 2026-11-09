export function damerauLevenshteinDistance(a: string, b: string): number {
  const aChars = Array.from(a);
  const bChars = Array.from(b);

  const n = aChars.length;
  const m = bChars.length;

  if (n === 0) return m;
  if (m === 0) return n;

  const maxDistance = n + m;

  const matrix = Array.from({ length: n + 2 }, () =>
    new Array<number>(m + 2).fill(0),
  );

  matrix[0][0] = maxDistance;

  for (let i = 0; i <= n; i++) {
    matrix[i + 1][0] = maxDistance;
    matrix[i + 1][1] = i;
  }

  for (let j = 0; j <= m; j++) {
    matrix[0][j + 1] = maxDistance;
    matrix[1][j + 1] = j;
  }

  const lastSeen = new Map<string, number>();

  for (let i = 1; i <= n; i++) {
    let lastMatchColumn = 0;

    for (let j = 1; j <= m; j++) {
      const previousRow = lastSeen.get(bChars[j - 1]) ?? 0;
      const previousColumn = lastMatchColumn;

      let cost = 1;

      if (aChars[i - 1] === bChars[j - 1]) {
        cost = 0;
        lastMatchColumn = j;
      }

      const substitution = matrix[i][j] + cost;

      const insertion = matrix[i + 1][j] + 1;

      const deletion = matrix[i][j + 1] + 1;

      const transposition =
        matrix[previousRow][previousColumn] +
        (i - previousRow - 1) +
        1 +
        (j - previousColumn - 1);

      matrix[i + 1][j + 1] = Math.min(
        substitution,
        insertion,
        deletion,
        transposition,
      );
    }

    lastSeen.set(aChars[i - 1], i);
  }

  return matrix[n + 1][m + 1];
}

export function damerauLevenshteinSimilarity(a: string, b: string): number {
  const maxLength = Math.max(Array.from(a).length, Array.from(b).length);

  if (maxLength === 0) {
    return 1;
  }

  const distance = damerauLevenshteinDistance(a, b);

  return 1 - distance / maxLength;
}