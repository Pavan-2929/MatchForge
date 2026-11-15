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

// src/matching/compareStrings.ts
function compareStrings(a, b, options = {}) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Both inputs must be strings.");
  }
  const {
    method = "jaro-winkler",
    normalization = {},
    algorithmOptions = {}
  } = options;
  const normalizedA = normalizeString(a, normalization);
  const normalizedB = normalizeString(b, normalization);
  const similarityFunction = algorithmRegistry[method];
  if (!similarityFunction) {
    throw new Error(`Unsupported similarity method: ${method}`);
  }
  return similarityFunction(normalizedA, normalizedB, algorithmOptions);
}

// src/matching/getMatchingFields.ts
function getMatchingFields(options) {
  const fields = options.fields ?? [
    {
      sourceKey: options.sourceKey,
      targetKey: options.targetKey,
      weight: 1
    }
  ];
  if (!Array.isArray(fields)) {
    throw new TypeError("Fields must be an array.");
  }
  if (fields.length === 0) {
    throw new Error("At least one matching field is required.");
  }
  for (const field of fields) {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      throw new TypeError("Each matching field must be an object.");
    }
    const weight = field.weight ?? 1;
    if (!field.sourceKey || !field.targetKey) {
      throw new Error("Source and target keys are required.");
    }
    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error("Weight must be a finite, non-negative number.");
    }
  }
  if (fields.every((field) => (field.weight ?? 1) === 0)) {
    throw new Error("At least one field must have a positive weight.");
  }
  return fields;
}

// src/matching/calculateWeightedScore.ts
function calculateWeightedScore(fieldScores) {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const field of fieldScores) {
    if (field.weight <= 0) {
      continue;
    }
    weightedSum += field.score * field.weight;
    totalWeight += field.weight;
  }
  if (totalWeight === 0) {
    return null;
  }
  return weightedSum / totalWeight;
}

// src/blocking/generateCandidates.ts
function getBlockingKey(record, key, index, recordType, rule, normalization) {
  const value = record[key];
  if (value === void 0 || value === null || value === "") {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new Error(
      `${recordType} record at index ${index} must have a string value for "${key}".`
    );
  }
  const normalized = normalizeString(value, normalization);
  if (normalized === "") {
    return void 0;
  }
  let blockingKey;
  switch (rule.method) {
    case "exact":
      blockingKey = normalized;
      break;
    case "prefix": {
      const length = rule.length ?? 3;
      if (!Number.isInteger(length) || length < 1) {
        throw new Error("Prefix blocking length must be a positive integer.");
      }
      blockingKey = normalized.slice(0, length);
      break;
    }
    case "soundex":
      blockingKey = soundex(normalized);
      break;
    default:
      throw new Error(`Unsupported blocking method: ${rule.method}`);
  }
  return blockingKey || void 0;
}
function validateRule(rule) {
  if (!rule.sourceKey || !rule.targetKey) {
    throw new Error("Each blocking rule must define sourceKey and targetKey.");
  }
  const supportedMethods = ["exact", "prefix", "soundex"];
  if (!supportedMethods.includes(rule.method)) {
    throw new Error(`Unsupported blocking method: ${rule.method}`);
  }
  if (rule.method === "prefix" && rule.length !== void 0 && (!Number.isInteger(rule.length) || rule.length < 1)) {
    throw new Error("Prefix blocking length must be a positive integer.");
  }
}
function generateCandidates(source, target, options) {
  if (!Array.isArray(source) || !Array.isArray(target)) {
    throw new TypeError("Source and target must be arrays.");
  }
  if (!options || !Array.isArray(options.rules) || options.rules.length === 0) {
    throw new Error("At least one blocking rule is required.");
  }
  options.rules.forEach(validateRule);
  const pairMap = /* @__PURE__ */ new Map();
  for (const rule of options.rules) {
    const targetBuckets = /* @__PURE__ */ new Map();
    target.forEach((record, targetIndex) => {
      if (record === null || typeof record !== "object" || Array.isArray(record)) {
        return;
      }
      const key = getBlockingKey(
        record,
        rule.targetKey,
        targetIndex,
        "Target",
        rule,
        options.normalization
      );
      if (key === void 0) {
        return;
      }
      const bucket = targetBuckets.get(key);
      if (bucket) {
        bucket.push(targetIndex);
      } else {
        targetBuckets.set(key, [targetIndex]);
      }
    });
    source.forEach((record, sourceIndex) => {
      if (record === null || typeof record !== "object" || Array.isArray(record)) {
        return;
      }
      const key = getBlockingKey(
        record,
        rule.sourceKey,
        sourceIndex,
        "Source",
        rule,
        options.normalization
      );
      if (key === void 0) {
        return;
      }
      const matchingIndexes = targetBuckets.get(key);
      if (!matchingIndexes) {
        return;
      }
      for (const targetIndex of matchingIndexes) {
        const pairId = `${sourceIndex}:${targetIndex}`;
        if (!pairMap.has(pairId)) {
          pairMap.set(pairId, {
            sourceIndex,
            targetIndex
          });
        }
      }
    });
  }
  const pairs = Array.from(pairMap.values());
  const totalPossiblePairs = source.length * target.length;
  const reductionPercentage = totalPossiblePairs === 0 ? 0 : (totalPossiblePairs - pairs.length) / totalPossiblePairs * 100;
  return {
    pairs,
    stats: {
      totalSourceRecords: source.length,
      totalTargetRecords: target.length,
      totalPossiblePairs,
      candidatePairs: pairs.length,
      reductionPercentage
    }
  };
}

// src/matching/matchRecords.ts
function getStringValue(record, key, index, recordType) {
  const value = record[key];
  if (value === void 0 || value === null) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new Error(
      `${recordType} record at index ${index} must have a string value for "${key}".`
    );
  }
  return value;
}
function getValidRecords(records) {
  return records.flatMap((record, originalIndex) => {
    if (record === null || typeof record !== "object" || Array.isArray(record)) {
      return [];
    }
    return [{ record, originalIndex }];
  });
}
function matchRecords(source, target, options) {
  if (!Array.isArray(source) || !Array.isArray(target)) {
    throw new TypeError("Source and target must be arrays.");
  }
  const validSource = getValidRecords(source);
  const validTarget = getValidRecords(target);
  const fields = getMatchingFields(options);
  const {
    method = "jaro-winkler",
    threshold = 0.7,
    topK = 1,
    normalization = {},
    algorithmOptions = {},
    blocking
  } = options;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error("Threshold must be between 0 and 1.");
  }
  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }
  const sourceRecords = validSource.map(({ record }) => record);
  const targetRecords = validTarget.map(({ record }) => record);
  const candidateTargetsBySource = /* @__PURE__ */ new Map();
  if (blocking) {
    const result = generateCandidates(sourceRecords, targetRecords, {
      ...blocking,
      normalization: blocking.normalization ?? normalization
    });
    for (const pair of result.pairs) {
      const indexes = candidateTargetsBySource.get(pair.sourceIndex);
      if (indexes) {
        indexes.push(pair.targetIndex);
      } else {
        candidateTargetsBySource.set(pair.sourceIndex, [pair.targetIndex]);
      }
    }
  }
  const allTargetIndexes = targetRecords.map((_, index) => index);
  const matches = validSource.map(
    ({ record: sourceRecord, originalIndex: sourceIndex }, validIndex) => {
      const candidates = [];
      const targetIndexes = blocking ? candidateTargetsBySource.get(validIndex) ?? [] : allTargetIndexes;
      targetIndexes.forEach((validTargetIndex) => {
        const targetRecord = targetRecords[validTargetIndex];
        const targetIndex = validTarget[validTargetIndex].originalIndex;
        const fieldScores = [];
        for (const field of fields) {
          const weight = field.weight ?? 1;
          if (weight === 0) {
            continue;
          }
          const sourceValue = getStringValue(
            sourceRecord,
            field.sourceKey,
            sourceIndex,
            "Source"
          );
          const targetValue = getStringValue(
            targetRecord,
            field.targetKey,
            targetIndex,
            "Target"
          );
          if (sourceValue === void 0 || targetValue === void 0) {
            continue;
          }
          if (sourceValue.trim() === "" || targetValue.trim() === "") {
            continue;
          }
          const score2 = compareStrings(sourceValue, targetValue, {
            method,
            normalization,
            algorithmOptions
          });
          fieldScores.push({
            sourceKey: field.sourceKey,
            targetKey: field.targetKey,
            score: score2,
            weight
          });
        }
        const score = calculateWeightedScore(fieldScores);
        if (score === null || score < threshold) {
          return;
        }
        candidates.push({
          record: targetRecord,
          targetIndex,
          score,
          method,
          fieldScores
        });
      });
      candidates.sort((a, b) => b.score - a.score);
      const topCandidates = candidates.slice(0, topK);
      return {
        source: sourceRecord,
        sourceIndex,
        candidates: topCandidates,
        matched: topCandidates.length > 0
      };
    }
  );
  const unmatched = matches.filter((match) => !match.matched).map((match) => match.source);
  return {
    matches,
    unmatched,
    totalSourceRecords: source.length,
    totalTargetRecords: target.length
  };
}

// src/csv/parseCSV.ts
import Papa from "papaparse";
function parseCSV(csvText, options = {}) {
  const result = Papa.parse(csvText, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: options.skipEmptyLines ?? true,
    delimiter: options.delimiter ?? ""
  });
  const records = result.data;
  const headers = result.meta.fields ?? [];
  const errors = result.errors.map((error) => ({
    type: error.type,
    code: error.code,
    message: error.message,
    row: error.row
  }));
  return {
    records,
    headers,
    errors,
    rowCount: records.length
  };
}

// src/matching/csv/matchCSV.ts
function matchCSV(sourceCSV, targetCSV, options) {
  const { sourceParseOptions, targetParseOptions, ...matchingOptions } = options;
  const sourceResult = parseCSV(sourceCSV, sourceParseOptions);
  const targetResult = parseCSV(targetCSV, targetParseOptions);
  const matchingResult = matchRecords(
    sourceResult.records,
    targetResult.records,
    matchingOptions
  );
  const sourceRecordNumbers = new Map(
    sourceResult.records.map((record, index) => [record, index + 1])
  );
  const targetRecordNumbers = new Map(
    targetResult.records.map((record, index) => [record, index + 1])
  );
  const matches = matchingResult.matches.map((match) => ({
    source: match.source,
    sourceRecordNumber: sourceRecordNumbers.get(match.source),
    candidates: match.candidates.map((candidate) => ({
      ...candidate,
      targetRecordNumber: targetRecordNumbers.get(candidate.record)
    })),
    matched: match.matched
  }));
  const unmatched = matchingResult.unmatched.map((record) => ({
    record,
    sourceRecordNumber: sourceRecordNumbers.get(record)
  }));
  return {
    matches,
    unmatched,
    totalSourceRecords: matchingResult.totalSourceRecords,
    totalTargetRecords: matchingResult.totalTargetRecords,
    sourceHeaders: sourceResult.headers,
    targetHeaders: targetResult.headers,
    parseErrors: {
      source: sourceResult.errors,
      target: targetResult.errors
    }
  };
}

// src/matching/csv/exportMatches.ts
import Papa2 from "papaparse";
function exportMatches(result, options = {}) {
  const fields = [
    "source_record_number",
    "target_record_number",
    "matched",
    "score",
    "method",
    ...result.sourceHeaders.map((header) => `source_${header}`),
    ...result.targetHeaders.map((header) => `target_${header}`)
  ];
  const rows = [];
  for (const match of result.matches) {
    const candidates = match.candidates.length ? match.candidates : [null];
    for (const candidate of candidates) {
      const row = {
        source_record_number: String(match.sourceRecordNumber),
        target_record_number: candidate ? String(candidate.targetRecordNumber) : "",
        matched: String(match.matched),
        score: candidate ? String(candidate.score) : "",
        method: candidate?.method ?? ""
      };
      for (const header of result.sourceHeaders) {
        row[`source_${header}`] = match.source[header] ?? "";
      }
      for (const header of result.targetHeaders) {
        row[`target_${header}`] = candidate?.record[header] ?? "";
      }
      rows.push(row);
    }
  }
  return Papa2.unparse(
    { fields, data: rows },
    { delimiter: options.delimiter ?? "," }
  );
}

// src/deduplication/findDuplicates.ts
function findDuplicatePairs(records, options) {
  if (!Array.isArray(records)) {
    throw new TypeError("Records must be an array.");
  }
  const invalidIndex = records.findIndex(
    (record) => record === null || typeof record !== "object" || Array.isArray(record)
  );
  if (invalidIndex !== -1) {
    throw new TypeError(
      `Record at index ${invalidIndex} must be a non-array object.`
    );
  }
  const blocking = options.blocking ? {
    rules: options.blocking.rules.map((rule) => ({
      sourceKey: rule.key,
      targetKey: rule.key,
      method: rule.method,
      length: rule.length
    })),
    normalization: options.blocking.normalization ?? options.normalization
  } : void 0;
  const matchingResult = matchRecords(records, records, {
    fields: options.fields.map((field) => ({
      sourceKey: field.key,
      targetKey: field.key,
      weight: field.weight
    })),
    method: options.method,
    threshold: options.threshold,
    topK: Math.max(records.length, 1),
    normalization: options.normalization,
    algorithmOptions: options.algorithmOptions,
    blocking
  });
  const pairs = [];
  matchingResult.matches.forEach((match, firstIndex) => {
    match.candidates.forEach((candidate) => {
      const secondIndex = candidate.targetIndex;
      if (secondIndex <= firstIndex) {
        return;
      }
      pairs.push({
        firstRecordIndex: firstIndex,
        secondRecordIndex: secondIndex,
        score: candidate.score,
        fieldScores: candidate.fieldScores
      });
    });
  });
  return pairs;
}
function createDuplicateGroups(records, pairs) {
  const connections = records.map(() => []);
  for (const pair of pairs) {
    connections[pair.firstRecordIndex].push(pair.secondRecordIndex);
    connections[pair.secondRecordIndex].push(pair.firstRecordIndex);
  }
  const visited = /* @__PURE__ */ new Set();
  const duplicateGroups = [];
  const uniqueRecords = [];
  for (let i = 0; i < records.length; i++) {
    if (visited.has(i)) {
      continue;
    }
    if (connections[i].length === 0) {
      visited.add(i);
      uniqueRecords.push(records[i]);
      continue;
    }
    const groupIndexes = [];
    const queue = [i];
    visited.add(i);
    while (queue.length > 0) {
      const current = queue.shift();
      groupIndexes.push(current);
      for (const neighbor of connections[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    const groupRecords = groupIndexes.map((index) => records[index]);
    const groupPairs = pairs.filter(
      (pair) => groupIndexes.includes(pair.firstRecordIndex) && groupIndexes.includes(pair.secondRecordIndex)
    );
    duplicateGroups.push({
      groupId: duplicateGroups.length + 1,
      records: groupRecords,
      duplicatePairs: groupPairs
    });
  }
  const duplicateRecordsCount = duplicateGroups.reduce(
    (total, group) => total + group.records.length,
    0
  );
  return {
    duplicateGroups,
    uniqueRecords,
    totalRecords: records.length,
    duplicateGroupsCount: duplicateGroups.length,
    duplicateRecordsCount,
    uniqueRecordsCount: uniqueRecords.length
  };
}
function findDuplicates(records, options) {
  const pairs = findDuplicatePairs(records, options);
  return createDuplicateGroups(records, pairs);
}

// src/deduplication/findDuplicatesCSV.ts
function findDuplicatesCSV(csvText, options) {
  const parsed = parseCSV(csvText);
  const result = findDuplicates(parsed.records, options);
  return {
    ...result,
    records: parsed.records,
    headers: parsed.headers,
    parseErrors: parsed.errors
  };
}

// src/deduplication/exportUniqueCSV.ts
import Papa3 from "papaparse";
function exportUniqueCSV(result, options = {}) {
  const keep = options.keep ?? "most-complete";
  const duplicateRecords = new Set(
    result.duplicateGroups.flatMap((group) => group.records)
  );
  const selectedRecords = /* @__PURE__ */ new Set();
  for (const group of result.duplicateGroups) {
    if (keep === "exclude") {
      continue;
    }
    let selectedRecord = group.records[0];
    if (keep === "most-complete") {
      let highestCount = 0;
      for (const record of group.records) {
        const count = Object.values(record).filter(
          (value) => value.trim() !== ""
        ).length;
        if (count > highestCount) {
          highestCount = count;
          selectedRecord = record;
        }
      }
    }
    selectedRecords.add(selectedRecord);
  }
  const recordsToExport = [];
  for (const record of result.records) {
    const isDuplicate = duplicateRecords.has(record);
    const isSelected = selectedRecords.has(record);
    if (!isDuplicate || isSelected) {
      recordsToExport.push(record);
    }
  }
  return Papa3.unparse({
    fields: result.headers,
    data: recordsToExport
  });
}

// src/evaluation/metrics.ts
function calculateMetrics(confusionMatrix) {
  const { truePositives, falsePositives, falseNegatives, trueNegatives } = confusionMatrix;
  const precisionDenominator = truePositives + falsePositives;
  const recallDenominator = truePositives + falseNegatives;
  const precision = precisionDenominator === 0 ? 0 : truePositives / precisionDenominator;
  const recall = recallDenominator === 0 ? 0 : truePositives / recallDenominator;
  const f1Denominator = precision + recall;
  const f1Score = f1Denominator === 0 ? 0 : 2 * precision * recall / f1Denominator;
  const total = truePositives + falsePositives + falseNegatives + trueNegatives;
  const accuracy = total === 0 ? 0 : (truePositives + trueNegatives) / total;
  return {
    precision,
    recall,
    f1Score,
    accuracy
  };
}

// src/evaluation/evaluateMatches.ts
function validateGroundTruth(groundTruth, totalSourceRecords, totalTargetRecords) {
  if (!Array.isArray(groundTruth)) {
    throw new TypeError("Ground truth must be an array.");
  }
  const seenPairs = /* @__PURE__ */ new Set();
  for (const pair of groundTruth) {
    if (!Number.isInteger(pair.sourceIndex) || pair.sourceIndex < 0 || pair.sourceIndex >= totalSourceRecords) {
      throw new Error(`Invalid source index: ${pair.sourceIndex}.`);
    }
    if (!Number.isInteger(pair.targetIndex) || pair.targetIndex < 0 || pair.targetIndex >= totalTargetRecords) {
      throw new Error(`Invalid target index: ${pair.targetIndex}.`);
    }
    if (typeof pair.isMatch !== "boolean") {
      throw new TypeError("isMatch must be a boolean.");
    }
    const key = `${pair.sourceIndex}:${pair.targetIndex}`;
    if (seenPairs.has(key)) {
      throw new Error(
        `Duplicate ground-truth pair: (${pair.sourceIndex}, ${pair.targetIndex}).`
      );
    }
    seenPairs.add(key);
  }
}
function evaluateMatches(options) {
  const { predictions, groundTruth } = options;
  if (!predictions || !Array.isArray(predictions.matches)) {
    throw new TypeError("Valid matching predictions are required.");
  }
  validateGroundTruth(
    groundTruth,
    predictions.totalSourceRecords,
    predictions.totalTargetRecords
  );
  const predictedPairs = /* @__PURE__ */ new Set();
  predictions.matches.forEach((match) => {
    match.candidates.forEach((candidate) => {
      predictedPairs.add(`${match.sourceIndex}:${candidate.targetIndex}`);
    });
  });
  const confusionMatrix = {
    truePositives: 0,
    falsePositives: 0,
    falseNegatives: 0,
    trueNegatives: 0
  };
  for (const pair of groundTruth) {
    const key = `${pair.sourceIndex}:${pair.targetIndex}`;
    const wasPredicted = predictedPairs.has(key);
    if (pair.isMatch && wasPredicted) {
      confusionMatrix.truePositives++;
    } else if (!pair.isMatch && wasPredicted) {
      confusionMatrix.falsePositives++;
    } else if (pair.isMatch && !wasPredicted) {
      confusionMatrix.falseNegatives++;
    } else {
      confusionMatrix.trueNegatives++;
    }
  }
  return {
    confusionMatrix,
    metrics: calculateMetrics(confusionMatrix),
    totalEvaluatedPairs: groundTruth.length
  };
}

// src/blocking-evaluation/metrics.ts
function calculateBlockingMetrics(counts) {
  const {
    trueCandidatePairs,
    totalTruePairs,
    totalLabelledCandidatePairs,
    totalCandidatePairs,
    totalPossiblePairs
  } = counts;
  const candidateRecall = totalTruePairs === 0 ? 0 : trueCandidatePairs / totalTruePairs;
  const candidatePrecision = totalLabelledCandidatePairs === 0 ? 0 : trueCandidatePairs / totalLabelledCandidatePairs;
  const reductionRatio = totalPossiblePairs === 0 ? 0 : 1 - totalCandidatePairs / totalPossiblePairs;
  return {
    candidateRecall,
    candidatePrecision,
    reductionRatio
  };
}

// src/blocking-evaluation/evaluateBlocking.ts
function getPairKey(sourceIndex, targetIndex) {
  return `${sourceIndex}:${targetIndex}`;
}
function validateGroundTruth2(groundTruth, totalSourceRecords, totalTargetRecords) {
  if (!Array.isArray(groundTruth)) {
    throw new TypeError("Ground truth must be an array.");
  }
  const seenPairs = /* @__PURE__ */ new Set();
  for (const pair of groundTruth) {
    if (!pair || typeof pair !== "object") {
      throw new TypeError("Invalid ground-truth pair.");
    }
    if (!Number.isInteger(pair.sourceIndex) || pair.sourceIndex < 0 || pair.sourceIndex >= totalSourceRecords) {
      throw new Error(`Invalid source index: ${pair.sourceIndex}.`);
    }
    if (!Number.isInteger(pair.targetIndex) || pair.targetIndex < 0 || pair.targetIndex >= totalTargetRecords) {
      throw new Error(`Invalid target index: ${pair.targetIndex}.`);
    }
    if (typeof pair.isMatch !== "boolean") {
      throw new TypeError("isMatch must be a boolean.");
    }
    const key = getPairKey(pair.sourceIndex, pair.targetIndex);
    if (seenPairs.has(key)) {
      throw new Error(
        `Duplicate ground-truth pair: (${pair.sourceIndex}, ${pair.targetIndex}).`
      );
    }
    seenPairs.add(key);
  }
}
function validateCandidates(pairs, totalSourceRecords, totalTargetRecords) {
  if (!Array.isArray(pairs)) {
    throw new TypeError("Candidate pairs must be an array.");
  }
  const candidatePairs = /* @__PURE__ */ new Set();
  for (const pair of pairs) {
    if (!pair || typeof pair !== "object") {
      throw new TypeError("Invalid candidate pair.");
    }
    if (!Number.isInteger(pair.sourceIndex) || pair.sourceIndex < 0 || pair.sourceIndex >= totalSourceRecords) {
      throw new Error(`Invalid candidate source index: ${pair.sourceIndex}.`);
    }
    if (!Number.isInteger(pair.targetIndex) || pair.targetIndex < 0 || pair.targetIndex >= totalTargetRecords) {
      throw new Error(`Invalid candidate target index: ${pair.targetIndex}.`);
    }
    const key = getPairKey(pair.sourceIndex, pair.targetIndex);
    if (candidatePairs.has(key)) {
      throw new Error(
        `Duplicate candidate pair: (${pair.sourceIndex}, ${pair.targetIndex}).`
      );
    }
    candidatePairs.add(key);
  }
  return candidatePairs;
}
function evaluateBlocking(options) {
  if (!options || typeof options !== "object") {
    throw new TypeError("Valid blocking evaluation options are required.");
  }
  const { candidates, groundTruth } = options;
  if (!candidates || typeof candidates !== "object" || !candidates.stats) {
    throw new TypeError("Valid candidate generation results are required.");
  }
  const {
    totalSourceRecords,
    totalTargetRecords,
    totalPossiblePairs,
    candidatePairs: reportedCandidatePairs
  } = candidates.stats;
  if (!Number.isInteger(totalSourceRecords) || totalSourceRecords < 0 || !Number.isInteger(totalTargetRecords) || totalTargetRecords < 0) {
    throw new Error("Invalid dataset record counts.");
  }
  const expectedPossiblePairs = totalSourceRecords * totalTargetRecords;
  if (!Number.isInteger(totalPossiblePairs) || totalPossiblePairs !== expectedPossiblePairs) {
    throw new Error("Invalid total possible pairs count.");
  }
  if (!Number.isInteger(reportedCandidatePairs) || reportedCandidatePairs < 0 || reportedCandidatePairs > totalPossiblePairs) {
    throw new Error("Invalid candidate pairs count.");
  }
  const candidateSet = validateCandidates(
    candidates.pairs,
    totalSourceRecords,
    totalTargetRecords
  );
  if (candidateSet.size !== reportedCandidatePairs) {
    throw new Error("Candidate pairs count does not match candidate pairs.");
  }
  validateGroundTruth2(groundTruth, totalSourceRecords, totalTargetRecords);
  let totalTruePairs = 0;
  let trueCandidatePairs = 0;
  let totalLabelledCandidatePairs = 0;
  for (const pair of groundTruth) {
    const key = getPairKey(pair.sourceIndex, pair.targetIndex);
    const isCandidate = candidateSet.has(key);
    if (pair.isMatch) {
      totalTruePairs++;
      if (isCandidate) {
        trueCandidatePairs++;
      }
    }
    if (isCandidate) {
      totalLabelledCandidatePairs++;
    }
  }
  const metrics = calculateBlockingMetrics({
    trueCandidatePairs,
    totalTruePairs,
    totalLabelledCandidatePairs,
    totalCandidatePairs: candidateSet.size,
    totalPossiblePairs
  });
  return {
    metrics,
    totalPossiblePairs,
    totalCandidatePairs: candidateSet.size,
    totalEvaluatedPairs: groundTruth.length,
    totalLabelledCandidatePairs,
    trueCandidatePairs,
    totalTruePairs
  };
}
export {
  compareStrings,
  cosineSimilarity,
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
  diceSimilarity,
  evaluateBlocking,
  evaluateMatches,
  exportMatches,
  exportUniqueCSV,
  findDuplicates,
  findDuplicatesCSV,
  generateCandidates,
  jaccardSimilarity,
  jaroSimilarity,
  jaroWinklerSimilarity,
  levenshteinDistance,
  levenshteinSimilarity,
  matchCSV,
  matchRecords,
  metaphone,
  metaphoneSimilarity,
  normalizeString,
  parseCSV,
  soundex,
  soundexSimilarity
};
