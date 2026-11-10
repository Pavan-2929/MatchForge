# MatchForge Core

**Smarter String Matching. Better Entity Resolution.**

MatchForge Core is a modular, framework-independent TypeScript library for comparing strings and matching records across datasets. It provides reusable similarity algorithms, configurable text normalization, and a record-matching engine with single-field and weighted multi-field matching.

Use the individual algorithms when you need direct similarity scores, `compareStrings()` for a consistent comparison API, or `matchRecords()` to find likely corresponding records between two datasets.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Algorithms](#supported-algorithms)
- [Text Preprocessing](#text-preprocessing)
- [API Reference](#api-reference)
  - [`normalizeString()`](#normalizestring)
  - [`compareStrings()`](#comparestrings)
  - [`matchRecords()`](#matchrecords)
- [Matching Configuration](#matching-configuration)
- [Understanding the Result](#understanding-the-result)
- [Direct Algorithm Functions](#direct-algorithm-functions)
- [TypeScript Support](#typescript-support)
- [Development](#development)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### String similarity

- **Levenshtein** — measures insertions, deletions, and substitutions.
- **Damerau-Levenshtein** — also accounts for adjacent character transpositions.
- **Jaro and Jaro-Winkler** — character-based similarity, useful for short strings and names.
- **Jaccard and Dice** — compare sets of character q-grams.
- **Cosine similarity** — compares q-gram frequency vectors.
- **Soundex and Metaphone** — phonetic encodings for approximate name comparison.

### Text preprocessing

- Lowercase conversion.
- Leading/trailing whitespace trimming.
- Whitespace normalization.
- Optional punctuation removal.
- Optional accent/diacritic removal.

### Record matching

- Match records from a source dataset against a target dataset.
- Match one field or multiple fields.
- Assign weights to individual fields.
- Select a similarity algorithm and threshold.
- Retrieve the top-K candidates for each source record.
- Inspect field-level scores.
- Identify source records with no qualifying candidates.
- Configure q-gram size for Jaccard, Dice, and Cosine.

---

## Installation

Install the package from npm:

```bash
npm install @matchforge/core
```

MatchForge Core is published as an ECMAScript module (ESM) package and includes TypeScript declarations.

---

## Quick Start

The following example matches people in one dataset against another using name and city.

```typescript
import { matchRecords } from "@matchforge/core";

const source = [
  { name: "Rahul Sharma", city: "Delhi" },
];

const target = [
  { name: "Rahul Sharma", city: "Delhi" },
  { name: "Amit Patel", city: "Ahmedabad" },
];

const result = matchRecords(source, target, {
  fields: [
    { sourceKey: "name", targetKey: "name", weight: 0.7 },
    { sourceKey: "city", targetKey: "city", weight: 0.3 },
  ],
  threshold: 0.7,
});

console.log(result.matches[0].candidates);
```

Each source record receives a ranked list of target candidates whose combined similarity score meets the configured threshold. The example gives the name field more influence than the city field.

For a simple comparison between two strings, use `compareStrings()`:

```typescript
import { compareStrings } from "@matchforge/core";

const score = compareStrings("Rahul Sharma", "Rahul Sharm", {
  method: "jaro-winkler",
});

console.log(score); // Similarity score between 0 and 1
```

---

## Supported Algorithms

All similarity functions return a score from `0` to `1`, where `1` indicates identical or equivalent input according to that algorithm.

| Algorithm | Comparison approach | Notes |
|---|---|---|
| `levenshtein` | Edit distance | Insertions, deletions, substitutions |
| `damerau-levenshtein` | Edit distance | Also handles adjacent transpositions |
| `jaro` | Character matching | Considers matching characters and transpositions |
| `jaro-winkler` | Jaro with prefix boost | Gives additional weight to a common prefix when the Jaro score is above 0.7 |
| `jaccard` | Q-gram set overlap | Compares unique character q-grams |
| `dice` | Q-gram set overlap | Uses the Dice coefficient |
| `cosine` | Q-gram frequency vectors | Considers q-gram frequencies |
| `soundex` | Phonetic encoding | Similarity is binary: `0` or `1` |
| `metaphone` | Phonetic encoding | Similarity is binary: `0` or `1` |

**Important:** Soundex and Metaphone similarities are binary in the current implementation. They return `1` when the generated codes are equal and `0` otherwise; they do not produce graded similarity scores.

The Metaphone implementation is a lightweight implementation included in this package. Do not assume it is fully equivalent to every Metaphone variant or implementation.

---

## Text Preprocessing

Use `normalizeString()` to normalize text before comparing or matching it.

```typescript
import { normalizeString } from "@matchforge/core";

const normalized = normalizeString("  José   SHARMA!  ", {
  lowercase: true,
  trim: true,
  normalizeWhitespace: true,
  removeAccents: true,
  removePunctuation: true,
});

console.log(normalized); // "jose sharma"
```

### Normalization options

All options are optional.

| Option | Default | Description |
|---|---:|---|
| `lowercase` | `true` | Converts text to lowercase |
| `trim` | `true` | Removes whitespace from the beginning and end |
| `normalizeWhitespace` | `true` | Replaces consecutive whitespace characters with a single space |
| `removePunctuation` | `false` | Removes Unicode punctuation characters |
| `removeAccents` | `false` | Removes Unicode diacritical marks |

Pass `{}` or omit the options argument to use the defaults.

`compareStrings()` and `matchRecords()` apply normalization through their `normalization` option. Direct algorithm functions do not automatically call `normalizeString()`.

---

## API Reference

### `normalizeString()`

Normalizes a string according to the supplied options.

```typescript
normalizeString(value: string, options?: NormalizeOptions): string
```

Example:

```typescript
const value = normalizeString("  NEW   Delhi ", {
  lowercase: true,
  trim: true,
});

console.log(value); // "new delhi"
```

### `compareStrings()`

Compares two strings using a selected similarity algorithm.

```typescript
compareStrings(a: string, b: string, options?: CompareOptions): number
```

Example:

```typescript
import { compareStrings } from "@matchforge/core";

const score = compareStrings("Jon Smith", "John Smith", {
  method: "jaro-winkler",
  normalization: {
    lowercase: true,
    trim: true,
  },
});

console.log(score);
```

#### `CompareOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `method` | `SimilarityMethod` | `"jaro-winkler"` | Similarity algorithm to use |
| `normalization` | `NormalizeOptions` | `{}` | Text normalization configuration |
| `algorithmOptions` | `QGramOptions` | `{}` | Algorithm-specific options, currently q-gram size |

For Jaccard, Dice, and Cosine, configure q-gram size through `algorithmOptions`:

```typescript
const score = compareStrings("matchforge", "match force", {
  method: "jaccard",
  algorithmOptions: {
    q: 3,
  },
});
```

The q-gram size `q` must be a positive integer. Its default is `2`.

### `matchRecords()`

Matches records from a source array against records in a target array.

```typescript
matchRecords<S extends object, T extends object>(
  source: S[],
  target: T[],
  options: MatchingOptions
): MatchingResult<S, T>
```

Each source record is compared with the target records. Qualifying candidates are ranked by descending score, and up to `topK` candidates are returned for each source record.

#### Single-field matching

Use `sourceKey` and `targetKey` when matching one field:

```typescript
import { matchRecords } from "@matchforge/core";

const result = matchRecords(
  [{ name: "Rahul Sharma" }],
  [
    { fullName: "Rahul Sharma" },
    { fullName: "Amit Patel" },
  ],
  {
    sourceKey: "name",
    targetKey: "fullName",
    method: "jaro-winkler",
    threshold: 0.8,
  },
);
```

#### Multi-field matching

Use `fields` to compare multiple field pairs. Each field can have an optional weight.

```typescript
const result = matchRecords(
  [
    { name: "Rahul Sharma", city: "Delhi", email: "rahul@example.com" },
  ],
  [
    { name: "Rahul Sharma", city: "Delhi", email: "rahul@example.com" },
    { name: "Rahul Sharma", city: "Mumbai", email: "other@example.com" },
  ],
  {
    fields: [
      { sourceKey: "name", targetKey: "name", weight: 0.5 },
      { sourceKey: "city", targetKey: "city", weight: 0.2 },
      { sourceKey: "email", targetKey: "email", weight: 0.3 },
    ],
    method: "jaro-winkler",
    threshold: 0.8,
    topK: 2,
  },
);
```

The final candidate score is a weighted average of the available field scores. Fields with a weight of `0` are ignored. If a field value is missing or blank on either side, that field is skipped for that candidate and the score is calculated from the remaining usable fields.

#### Matching behavior

- The default similarity method is `jaro-winkler`.
- The default threshold is `0.7`.
- The default `topK` is `1`.
- A candidate is included when its score is greater than or equal to the threshold.
- Candidates are sorted by score in descending order.
- Each source record is matched independently; target records are not reserved or consumed.
- Null rows, primitive rows, and array rows in the source or target arrays are skipped.
- A missing, `null`, or blank matching field is skipped for that field comparison.
- A non-null field value that is not a string causes an error.
- If no usable positive-weight field remains for a candidate, that candidate is not returned.

---

## Matching Configuration

`MatchingOptions` supports either a single field pair or a list of field pairs.

| Option | Type | Default | Description |
|---|---|---|---|
| `sourceKey` | `string` | — | Field name to read from each source record (single-field mode) |
| `targetKey` | `string` | — | Field name to read from each target record (single-field mode) |
| `fields` | `MatchingField[]` | — | Field mappings for multi-field matching |
| `method` | `SimilarityMethod` | `"jaro-winkler"` | Algorithm used for every configured field |
| `threshold` | `number` | `0.7` | Minimum combined score required to include a candidate; valid range is 0 to 1 |
| `topK` | `number` | `1` | Maximum number of candidates returned per source record; must be a positive integer |
| `normalization` | `NormalizeOptions` | `{}` | Normalization applied before each field comparison |
| `algorithmOptions` | `QGramOptions` | `{}` | Algorithm options, including q-gram size |

### `MatchingField`

| Property | Type | Default | Description |
|---|---|---:|---|
| `sourceKey` | `string` | Required | Field name in the source record |
| `targetKey` | `string` | Required | Field name in the target record |
| `weight` | `number` | `1` | Relative influence of this field in the weighted score; must be finite and non-negative |

At least one configured field must have a positive weight. Weights do not need to add up to `1`; the matching engine calculates the weighted average.

---

## Understanding the Result

`matchRecords()` returns a `MatchingResult<S, T>` object:

```typescript
interface MatchingResult<S, T> {
  matches: RecordMatch<S, T>[];
  unmatched: S[];
  totalSourceRecords: number;
  totalTargetRecords: number;
}
```

Each item in `matches` has this structure:

```typescript
interface RecordMatch<S, T> {
  source: S;
  candidates: MatchCandidate<T>[];
  matched: boolean;
}
```

Each candidate contains the target record, its combined score, the selected method, and the field-level scores:

```typescript
interface MatchCandidate<T> {
  record: T;
  score: number;
  method: SimilarityMethod;
  fieldScores: FieldMatchScore[];
}
```

A field-level score contains:

```typescript
interface FieldMatchScore {
  sourceKey: string;
  targetKey: string;
  score: number;
  weight: number;
}
```

Example:

```typescript
const firstMatch = result.matches[0];

if (firstMatch?.matched) {
  console.log("Best candidate:", firstMatch.candidates[0]?.record);
  console.log("Combined score:", firstMatch.candidates[0]?.score);
  console.log("Field scores:", firstMatch.candidates[0]?.fieldScores);
} else {
  console.log("No candidate met the threshold.");
}
```

`unmatched` contains source records for which no candidate met the threshold. `totalSourceRecords` and `totalTargetRecords` report the numbers of valid object records considered after invalid rows are skipped.

---

## Direct Algorithm Functions

Individual algorithms are also exported for use without the matching engine.

```typescript
import {
  levenshteinDistance,
  levenshteinSimilarity,
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
  jaroSimilarity,
  jaroWinklerSimilarity,
  jaccardSimilarity,
  diceSimilarity,
  cosineSimilarity,
  soundex,
  soundexSimilarity,
  metaphone,
  metaphoneSimilarity,
} from "@matchforge/core";
```

The edit-distance functions return integer edit distances, while their corresponding similarity functions return normalized scores between `0` and `1`.

Jaccard, Dice, and Cosine accept an optional `QGramOptions` object:

```typescript
const score = cosineSimilarity("database", "data base", { q: 2 });
```

Soundex and Metaphone also expose their encoding functions (`soundex()` and `metaphone()`) in addition to their binary similarity functions.

---

## TypeScript Support

MatchForge Core is written in TypeScript and ships declaration files.

Public types can be imported directly:

```typescript
import {
  matchRecords,
  type MatchingOptions,
  type MatchingResult,
  type SimilarityMethod,
  type NormalizeOptions,
  type QGramOptions,
  type CompareOptions,
} from "@matchforge/core";

const method: SimilarityMethod = "jaro-winkler";

const options: MatchingOptions = {
  sourceKey: "name",
  targetKey: "fullName",
  method,
  threshold: 0.8,
};

const result: MatchingResult<
  { name: string },
  { fullName: string }
> = matchRecords(
  [{ name: "Rahul Sharma" }],
  [{ fullName: "Rahul Sharma" }],
  options,
);
```

---

## Development

The repository is an npm-workspaces monorepo. Run the following commands from the repository root unless stated otherwise.

Install dependencies:

```bash
npm install
```

Build the core package:

```bash
npm run build --workspace=@matchforge/core
```

Run core package tests:

```bash
npm run test --workspace=@matchforge/core
```

Create a package tarball for local installation testing:

```bash
npm pack --workspace=@matchforge/core
```

To install and test the generated tarball in another project:

```bash
npm install /path/to/matchforge-core-0.1.0.tgz
```

---

## Project Structure

```text
packages/
└── core/
    ├── src/
    │   ├── matching/       # String comparison and record matching
    │   ├── preprocessing/  # Text normalization
    │   ├── similarity/     # Similarity and phonetic algorithms
    │   ├── types/          # Public TypeScript types
    │   └── index.ts        # Public package exports
    ├── tests/              # Unit tests
    ├── dist/               # Generated JavaScript and declarations
    ├── package.json
    └── README.md
```

---

## Roadmap

Planned areas of development include:

- Algorithm evaluation and benchmarking.
- Schema matching.
- CSV-based matching workflows.
- Matching explanations and visualization.
- Additional entity-resolution workflows.

---

## License

MatchForge Core is released under the [MIT License](LICENSE).
