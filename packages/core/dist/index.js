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

// src/similarity/cosine.ts
function generateQGramFrequencies(value, q) {
  const characters = Array.from(value);
  const frequencies = /* @__PURE__ */ new Map();
  for (let i = 0; i <= characters.length - q; i++) {
    const gram = characters.slice(i, i + q).join("");
    frequencies.set(gram, (frequencies.get(gram) ?? 0) + 1);
  }
  return frequencies;
}
function cosineSimilarity(a, b, options = {}) {
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
  const denominator = Math.sqrt(aMagnitudeSquared) * Math.sqrt(bMagnitudeSquared);
  return dotProduct / denominator;
}

// src/similarity/soundex.ts
var SOUNDEX_MAP = {
  B: "1",
  F: "1",
  P: "1",
  V: "1",
  C: "2",
  G: "2",
  J: "2",
  K: "2",
  Q: "2",
  S: "2",
  X: "2",
  Z: "2",
  D: "3",
  T: "3",
  L: "4",
  M: "5",
  N: "5",
  R: "6"
};
function soundex(value) {
  const word = value.toUpperCase().replace(/[^A-Z]/g, "");
  if (word.length === 0) {
    return "";
  }
  const firstLetter = word[0];
  const digits = [];
  let previousCode = SOUNDEX_MAP[firstLetter] ?? "";
  for (const character of word.slice(1)) {
    const currentCode = SOUNDEX_MAP[character] ?? "";
    if (currentCode === "") {
      if (character !== "H" && character !== "W") {
        previousCode = "";
      }
      continue;
    }
    if (currentCode !== previousCode) {
      digits.push(currentCode);
    }
    previousCode = currentCode;
    if (digits.length === 3) {
      break;
    }
  }
  return (firstLetter + digits.join("")).padEnd(4, "0");
}
function soundexSimilarity(a, b) {
  return soundex(a) === soundex(b) ? 1 : 0;
}

// src/similarity/metaphone.ts
function metaphone(value) {
  let word = value.toUpperCase().replace(/[^A-Z]/g, "");
  if (word.length === 0) {
    return "";
  }
  if (/^(KN|GN|PN|AE|WR)/.test(word)) {
    word = word.slice(1);
  } else if (word.startsWith("X")) {
    word = `S${word.slice(1)}`;
  }
  let result = "";
  const isVowel = (char) => "AEIOU".includes(char ?? "");
  for (let i = 0; i < word.length; i++) {
    const current = word[i];
    const previous = word[i - 1];
    const next = word[i + 1];
    const nextNext = word[i + 2];
    if (current === previous && current !== "C") {
      continue;
    }
    switch (current) {
      case "A":
      case "E":
      case "I":
      case "O":
      case "U":
        if (i === 0) result += current;
        break;
      case "B":
        if (!(previous === "M" && i === word.length - 1)) {
          result += "B";
        }
        break;
      case "C":
        if (previous === "S" && "IEY".includes(next ?? "")) {
          break;
        }
        if (next === "H") {
          result += "X";
          i++;
        } else if ("IEY".includes(next ?? "")) {
          result += "S";
        } else {
          result += "K";
        }
        break;
      case "D":
        if (next === "G" && "IEY".includes(nextNext ?? "")) {
          result += "J";
          i++;
        } else {
          result += "T";
        }
        break;
      case "G":
        if (next === "H") {
          if (i + 2 < word.length && !isVowel(previous)) {
            i++;
            break;
          }
          if (i > 0 && isVowel(previous) && i + 2 >= word.length) {
            i++;
            break;
          }
          if (i === 0) {
            result += "K";
            i++;
            break;
          }
          i++;
          break;
        }
        if (next === "N" && i + 1 === word.length - 1) {
          break;
        }
        if ("IEY".includes(next ?? "")) {
          result += "J";
        } else {
          result += "K";
        }
        break;
      case "H":
        if ((i === 0 || isVowel(previous)) && isVowel(next)) {
          result += "H";
        }
        break;
      case "F":
      case "J":
      case "L":
      case "M":
      case "N":
      case "R":
        result += current;
        break;
      case "K":
        if (previous !== "C") result += "K";
        break;
      case "P":
        result += next === "H" ? "F" : "P";
        if (next === "H") i++;
        break;
      case "Q":
        result += "K";
        break;
      case "S":
        if (next === "H") {
          result += "X";
          i++;
        } else if (next === "I" && (nextNext === "O" || nextNext === "A")) {
          result += "X";
        } else {
          result += "S";
        }
        break;
      case "T":
        if (next === "H") {
          result += "0";
          i++;
        } else if (next === "I" && (nextNext === "O" || nextNext === "A")) {
          result += "X";
        } else if (next === "C" && nextNext === "H") {
          break;
        } else {
          result += "T";
        }
        break;
      case "V":
        result += "F";
        break;
      case "W":
      case "Y":
        if (isVowel(next)) result += current;
        break;
      case "X":
        result += "KS";
        break;
      case "Z":
        result += "S";
        break;
    }
  }
  return result;
}
function metaphoneSimilarity(a, b) {
  return metaphone(a) === metaphone(b) ? 1 : 0;
}

// src/matching/algorithmRegistry.ts
var algorithmRegistry = {
  levenshtein: levenshteinSimilarity,
  "damerau-levenshtein": damerauLevenshteinSimilarity,
  jaro: jaroSimilarity,
  "jaro-winkler": jaroWinklerSimilarity,
  jaccard: jaccardSimilarity,
  dice: diceSimilarity,
  cosine: cosineSimilarity,
  soundex: soundexSimilarity,
  metaphone: metaphoneSimilarity
};

// src/matching/compareRecords.ts
function compareRecords(a, b, options = {}) {
  const {
    method = "jaro-winkler",
    normalization = {},
    algorithmOptions = {}
  } = options;
  const normalizedA = normalizeString(a, normalization);
  const normalizedB = normalizeString(b, normalization);
  const similarityFunction = algorithmRegistry[method];
  return similarityFunction(normalizedA, normalizedB, algorithmOptions);
}

// src/matching/matchRecords.ts
function getStringValue(record, key, index, recordType) {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(
      `${recordType} record at index ${index} must have a string value for "${key}".`
    );
  }
  return value;
}
function matchRecords(source, target, options) {
  const {
    sourceKey,
    targetKey,
    method = "jaro-winkler",
    threshold = 0.7,
    topK = 1,
    normalization = {},
    algorithmOptions = {}
  } = options;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error("Threshold must be between 0 and 1.");
  }
  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }
  const matches = source.map((sourceRecord, sourceIndex) => {
    const sourceValue = getStringValue(
      sourceRecord,
      sourceKey,
      sourceIndex,
      "Source"
    );
    const normalizedSource = normalizeString(sourceValue, normalization);
    if (normalizedSource.trim().length === 0) {
      return {
        source: sourceRecord,
        candidates: [],
        matched: false
      };
    }
    const candidates = target.map((targetRecord, targetIndex) => {
      const targetValue = getStringValue(
        targetRecord,
        targetKey,
        targetIndex,
        "Target"
      );
      if (normalizeString(targetValue, normalization).trim() === "") {
        return null;
      }
      const score = compareRecords(sourceValue, targetValue, {
        method,
        normalization,
        algorithmOptions
      });
      return {
        record: targetRecord,
        score,
        method
      };
    }).filter((candidate) => candidate !== null).filter((candidate) => candidate.score >= threshold).sort((a, b) => b.score - a.score).slice(0, topK);
    return {
      source: sourceRecord,
      candidates,
      matched: candidates.length > 0
    };
  });
  const unmatched = matches.filter((match) => !match.matched).map((match) => match.source);
  return {
    matches,
    unmatched,
    totalSourceRecords: source.length,
    totalTargetRecords: target.length
  };
}
export {
  compareRecords,
  cosineSimilarity,
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
  diceSimilarity,
  jaccardSimilarity,
  jaroSimilarity,
  jaroWinklerSimilarity,
  levenshteinDistance,
  levenshteinSimilarity,
  matchRecords,
  metaphone,
  metaphoneSimilarity,
  normalizeString,
  soundex,
  soundexSimilarity
};
