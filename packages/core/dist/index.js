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
export {
  levenshteinDistance,
  levenshteinSimilarity,
  normalizeString
};
