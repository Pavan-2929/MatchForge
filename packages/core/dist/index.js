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

// src/similarity/jaro.ts
function jaroSimilarity(a, b) {
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
    0
  );
  const aMatches = new Array(aLength).fill(false);
  const bMatches = new Array(bLength).fill(false);
  let matches = 0;
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
  const matchedA = aChars.filter((_, i) => aMatches[i]);
  const matchedB = bChars.filter((_, i) => bMatches[i]);
  let mismatches = 0;
  for (let i = 0; i < matches; i++) {
    if (matchedA[i] !== matchedB[i]) {
      mismatches++;
    }
  }
  const transpositions = mismatches / 2;
  return (matches / aLength + matches / bLength + (matches - transpositions) / matches) / 3;
}
function jaroWinklerSimilarity(a, b) {
  const jaroScore = jaroSimilarity(a, b);
  if (jaroScore <= 0.7) {
    return jaroScore;
  }
  const aChars = Array.from(a);
  const bChars = Array.from(b);
  let prefixLength = 0;
  const maxPrefixLength = 4;
  while (prefixLength < Math.min(aChars.length, bChars.length, maxPrefixLength) && aChars[prefixLength] === bChars[prefixLength]) {
    prefixLength++;
  }
  const scalingFactor = 0.1;
  return jaroScore + prefixLength * scalingFactor * (1 - jaroScore);
}

// src/similarity/qgram.ts
function generateQGrams(value, q) {
  const characters = Array.from(value);
  const qGrams = /* @__PURE__ */ new Set();
  for (let i = 0; i <= characters.length - q; i++) {
    qGrams.add(characters.slice(i, i + q).join(""));
  }
  return qGrams;
}
function jaccardSimilarity(a, b, options = {}) {
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
  const unionSize = (/* @__PURE__ */ new Set([...aGrams, ...bGrams])).size;
  return intersectionSize / unionSize;
}
function diceSimilarity(a, b, options = {}) {
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
  return 2 * intersectionSize / (aGrams.size + bGrams.size);
}
export {
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
  diceSimilarity,
  jaccardSimilarity,
  jaroSimilarity,
  jaroWinklerSimilarity,
  levenshteinDistance,
  levenshteinSimilarity,
  normalizeString
};
