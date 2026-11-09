// src/preprocessing/normalize.ts
function normalizeString(value, options = {}) {
  const {
    lowercase = true,
    trim = true,
    removePunctuation = false,
    removeAccents = false,
    normalizeWhitespace = true
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

// src/similarity/levenshtein.ts
function levenshteinDistance(a, b) {
  const aChars = Array.from(a);
  const bChars = Array.from(b);
  if (a === b) {
    return 0;
  }
  if (aChars.length === 0) {
    return bChars.length;
  }
  if (bChars.length === 0) {
    return aChars.length;
  }
  let source = aChars;
  let target = bChars;
  if (target.length > source.length) {
    [source, target] = [target, source];
  }
  let previousRow = Array.from(
    { length: target.length + 1 },
    (_, index) => index
  );
  for (let i = 1; i <= source.length; i++) {
    const currentRow = new Array(target.length + 1);
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
function levenshteinSimilarity(a, b) {
  const maxLength = Math.max(Array.from(a).length, Array.from(b).length);
  if (maxLength === 0) {
    return 1;
  }
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLength;
}

// src/similarity/damerauLevenshtein.ts
function damerauLevenshteinDistance(a, b) {
  const aChars = Array.from(a);
  const bChars = Array.from(b);
  const n = aChars.length;
  const m = bChars.length;
  if (n === 0) return m;
  if (m === 0) return n;
  const maxDistance = n + m;
  const matrix = Array.from(
    { length: n + 2 },
    () => new Array(m + 2).fill(0)
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
  const lastSeen = /* @__PURE__ */ new Map();
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
      const transposition = matrix[previousRow][previousColumn] + (i - previousRow - 1) + 1 + (j - previousColumn - 1);
      matrix[i + 1][j + 1] = Math.min(
        substitution,
        insertion,
        deletion,
        transposition
      );
    }
    lastSeen.set(aChars[i - 1], i);
  }
  return matrix[n + 1][m + 1];
}
function damerauLevenshteinSimilarity(a, b) {
  const maxLength = Math.max(Array.from(a).length, Array.from(b).length);
  if (maxLength === 0) {
    return 1;
  }
  const distance = damerauLevenshteinDistance(a, b);
  return 1 - distance / maxLength;
}
export {
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
  levenshteinDistance,
  levenshteinSimilarity,
  normalizeString
};
