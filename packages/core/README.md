# MatchForge Core

**Smarter String Matching. Better Entity Resolution.**

MatchForge Core is a framework-independent TypeScript library for string similarity, record matching, and dataset deduplication.

It provides nine similarity algorithms, configurable text preprocessing, weighted multi-field matching, CSV utilities, and duplicate detection for JavaScript records and CSV datasets.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Algorithms](#supported-algorithms)
- [Text Preprocessing](#text-preprocessing)
- [String Comparison](#string-comparison)
- [Record Matching](#record-matching)
- [CSV Utilities](#csv-utilities)
- [Dataset Deduplication](#dataset-deduplication)
- [CSV Deduplication](#csv-deduplication)
- [Direct Algorithm Functions](#direct-algorithm-functions)
- [TypeScript Support](#typescript-support)
- [License](#license)

---

## Features

**String Similarity**
- Nine similarity algorithms.
- Edit-distance, character-based, q-gram, and phonetic comparisons.
- Similarity scores between 0 and 1.

**Text Preprocessing**
- Lowercase conversion.
- Whitespace trimming and normalization.
- Optional punctuation removal.
- Optional accent and diacritic removal.

**Record Matching**
- Match records across two datasets.
- Single-field and multi-field matching.
- Weighted field comparisons.
- Configurable similarity methods and thresholds.
- Top-K candidate selection.
- Field-level similarity scores.

**CSV Utilities**
- Parse CSV text into JavaScript records.
- Match records directly from two CSV datasets.
- Export matching results as CSV.
- Preserve original column information and record numbers.
- Access CSV parsing errors.

**Dataset Deduplication**
- Detect duplicates within a single dataset.
- Support multiple matching fields and weights.
- Group connected duplicate records.
- Retrieve duplicate pairs and similarity scores.
- Identify unique records.

**CSV Deduplication**
- Detect duplicates directly from CSV text.
- Export cleaned CSV data.
- Choose which records to retain using different strategies.

---

## Installation

Install MatchForge Core from npm:

```bash
npm install @matchforge/core
```

MatchForge Core is published as an ECMAScript module (ESM) package and includes TypeScript declaration files.

---

## Quick Start

### Compare two strings

```typescript
import { compareStrings } from "@matchforge/core";

const score = compareStrings("Rahul Sharma", "Rahul Sharm", {
  method: "jaro-winkler",
});

console.log(score);
```

### Match two datasets

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

console.log(result.matches);
```

### Detect duplicate records

```typescript
import { findDuplicates } from "@matchforge/core";

const customers = [
  { name: "Rahul Sharma", email: "rahul@gmail.com" },
  { name: "Rahul S.", email: "rahul@gmail.com" },
  { name: "Pavan Kapadiya", email: "pavan@gmail.com" },
];

const result = findDuplicates(customers, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  threshold: 0.85,
});

console.log(result.duplicateGroups);
console.log(result.uniqueRecords);
```

---

## Supported Algorithms

MatchForge provides nine similarity algorithms.

All similarity functions return a score between `0` and `1`, where `1` indicates identical or equivalent input according to the selected algorithm.

| Algorithm | Comparison approach | Description |
|---|---|---|
| `levenshtein` | Edit distance | Measures insertions, deletions, and substitutions |
| `damerau-levenshtein` | Edit distance | Also handles adjacent character transpositions |
| `jaro` | Character matching | Considers matching characters and transpositions |
| `jaro-winkler` | Character matching | Adds a prefix-based similarity boost |
| `jaccard` | Q-gram sets | Measures overlap between unique character q-grams |
| `dice` | Q-gram sets | Uses the Dice similarity coefficient |
| `cosine` | Q-gram frequencies | Compares q-gram frequency vectors |
| `soundex` | Phonetic encoding | Compares Soundex codes |
| `metaphone` | Phonetic encoding | Compares Metaphone codes |

**Note:** Soundex and Metaphone similarities are binary. They return `1` when the generated phonetic codes match and `0` otherwise.

The Metaphone implementation is a lightweight implementation and may not be equivalent to every Metaphone variant.

---

## Text Preprocessing

Use `normalizeString()` to normalize text before comparison.

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

### NormalizeOptions

All options are optional.

| Option | Type | Default | Description |
|---|---|---|---|
| `lowercase` | `boolean` | `true` | Converts text to lowercase |
| `trim` | `boolean` | `true` | Removes leading and trailing whitespace |
| `normalizeWhitespace` | `boolean` | `true` | Replaces consecutive whitespace with a single space |
| `removePunctuation` | `boolean` | `false` | Removes Unicode punctuation characters |
| `removeAccents` | `boolean` | `false` | Removes Unicode diacritical marks |

`compareStrings()` and `matchRecords()` apply normalization through their `normalization` option.

Direct algorithm functions do not automatically normalize their inputs.

---

## String Comparison

Use `compareStrings()` to compare two strings with a selected similarity algorithm.

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

### CompareOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `method` | `SimilarityMethod` | `"jaro-winkler"` | Algorithm used for comparison |
| `normalization` | `NormalizeOptions` | `{}` | Text normalization configuration |
| `algorithmOptions` | `QGramOptions` | `{}` | Algorithm-specific options |

For Jaccard, Dice, and Cosine, configure the q-gram size using `algorithmOptions`.

```typescript
const score = compareStrings("matchforge", "match force", {
  method: "jaccard",
  algorithmOptions: {
    q: 3,
  },
});
```

The q-gram size must be a positive integer. Its default is `2`.

---

## Record Matching

Use `matchRecords()` to find corresponding records between two datasets.

```typescript
import { matchRecords } from "@matchforge/core";

const source = [
  { name: "Rahul Sharma", city: "Delhi" },
  { name: "Amit Shah", city: "Ahmedabad" },
];

const target = [
  { fullName: "Rahul Sharma", location: "Delhi" },
  { fullName: "Amit Patel", location: "Ahmedabad" },
];

const result = matchRecords(source, target, {
  fields: [
    { sourceKey: "name", targetKey: "fullName", weight: 0.7 },
    { sourceKey: "city", targetKey: "location", weight: 0.3 },
  ],
  method: "jaro-winkler",
  threshold: 0.75,
  topK: 2,
});

console.log(result.matches);
console.log(result.unmatched);
```

### Single-field Matching

Use `sourceKey` and `targetKey` when comparing one field.

```typescript
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

### Multi-field Matching

Use `fields` to compare multiple field pairs.

Each field can have an optional weight that controls its influence on the final score.

```typescript
const result = matchRecords(
  [
    {
      name: "Rahul Sharma",
      city: "Delhi",
      email: "rahul@example.com",
    },
  ],
  [
    {
      name: "Rahul Sharma",
      city: "Delhi",
      email: "rahul@example.com",
    },
    {
      name: "Rahul Sharma",
      city: "Mumbai",
      email: "other@example.com",
    },
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

The final score is a weighted average of the available field scores.

Fields with a weight of `0` are ignored. Missing or blank values are skipped for that field comparison.

### MatchingOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `sourceKey` | `string` | — | Source field name for single-field matching |
| `targetKey` | `string` | — | Target field name for single-field matching |
| `fields` | `MatchingField[]` | — | Field mappings for multi-field matching |
| `method` | `SimilarityMethod` | `"jaro-winkler"` | Similarity algorithm |
| `threshold` | `number` | `0.7` | Minimum score required for a candidate |
| `topK` | `number` | `1` | Maximum candidates returned per source record |
| `normalization` | `NormalizeOptions` | `{}` | Text normalization configuration |
| `algorithmOptions` | `QGramOptions` | `{}` | Algorithm-specific options |

The threshold must be between `0` and `1`. `topK` must be a positive integer.

Use either `fields` or the `sourceKey` and `targetKey` pair.

### MatchingField

| Property | Type | Default | Description |
|---|---|---|---|
| `sourceKey` | `string` | Required | Field name in the source record |
| `targetKey` | `string` | Required | Field name in the target record |
| `weight` | `number` | `1` | Relative influence of the field |

At least one field must have a positive weight. Weights do not need to add up to `1`.

### Understanding the Result

`matchRecords()` returns a `MatchingResult` containing:

```typescript
{
  matches: [],
  unmatched: [],
  totalSourceRecords: 0,
  totalTargetRecords: 0,
}
```

Each match contains:

- `source`: Original source record.
- `candidates`: Ranked target candidates.
- `matched`: Whether at least one candidate met the threshold.

Each candidate contains:

- `record`: Target record.
- `score`: Combined similarity score.
- `method`: Similarity algorithm used.
- `fieldScores`: Individual field comparison results.

`unmatched` contains source records for which no candidate met the threshold.

Target records are not reserved or consumed. The same target record can match multiple source records.

---

## CSV Utilities

MatchForge provides utilities for working directly with CSV text.

### Parsing CSV

Use `parseCSV()` to convert CSV text into JavaScript records.

```typescript
import { parseCSV } from "@matchforge/core";

const csv = `name,email
Rahul Sharma,rahul@gmail.com
Pavan Kapadiya,pavan@gmail.com`;

const result = parseCSV(csv);

console.log(result.records);
console.log(result.headers);
console.log(result.errors);
```

The result contains:

| Property | Description |
|---|---|
| `records` | Parsed CSV records |
| `headers` | CSV column names |
| `errors` | Parsing errors reported by PapaParse |
| `rowCount` | Number of parsed records |

### CSVParseOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `delimiter` | `string` | Auto-detected | CSV field delimiter |
| `skipEmptyLines` | `boolean \| "greedy"` | `true` | Controls how empty lines are handled |

CSV values are returned as strings. Automatic type conversion is disabled.

### Matching CSV Datasets

Use `matchCSV()` to match records from two CSV datasets without manually parsing them.

```typescript
import { matchCSV } from "@matchforge/core";

const sourceCSV = `name,city
Rahul Sharma,Delhi
Amit Shah,Ahmedabad`;

const targetCSV = `fullName,location
Rahul Sharma,Delhi
Amit Patel,Ahmedabad`;

const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "fullName", weight: 0.7 },
    { sourceKey: "city", targetKey: "location", weight: 0.3 },
  ],
  threshold: 0.75,
  topK: 2,
});

console.log(result.matches);
console.log(result.unmatched);
```

`matchCSV()` uses the same matching configuration as `matchRecords()`.

It also returns:

- Source and target CSV headers.
- Source and target record numbers.
- Parsing errors for both CSV inputs.
- Matching results and unmatched source records.

You can customize parsing separately for each input using `sourceParseOptions` and `targetParseOptions`.

### Exporting Matching Results

Use `exportMatches()` to convert CSV matching results into a CSV string.

```typescript
import { matchCSV, exportMatches } from "@matchforge/core";

const result = matchCSV(sourceCSV, targetCSV, {
  sourceKey: "name",
  targetKey: "fullName",
  threshold: 0.8,
});

const output = exportMatches(result);

console.log(output);
```

The exported CSV includes:

- Source and target record numbers.
- Whether a candidate matched.
- Similarity score and method.
- Source record fields prefixed with `source_`.
- Target record fields prefixed with `target_`.

### CSVExportOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `delimiter` | `string` | `","` | Delimiter used in the exported CSV |

---

## Dataset Deduplication

Use `findDuplicates()` to identify duplicate records within a single dataset.

Unlike `matchRecords()`, which compares two separate datasets, `findDuplicates()` compares records within the same dataset.

```typescript
import { findDuplicates } from "@matchforge/core";

const customers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com" },
  { id: 2, name: "Rahul S.", email: "rahul@gmail.com" },
  { id: 3, name: "Pavan Kapadiya", email: "pavan@gmail.com" },
  { id: 4, name: "Amit Shah", email: "amit@gmail.com" },
];

const result = findDuplicates(customers, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  method: "jaro-winkler",
  threshold: 0.85,
});

console.log(result.duplicateGroups);
console.log(result.uniqueRecords);
```

### DuplicateOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `fields` | `DuplicateField[]` | Required | Fields used to compare records |
| `method` | `SimilarityMethod` | `"jaro-winkler"` | Similarity algorithm |
| `threshold` | `number` | `0.7` | Minimum score required to identify a duplicate |
| `normalization` | `NormalizeOptions` | `{}` | Text normalization configuration |
| `algorithmOptions` | `QGramOptions` | `{}` | Algorithm-specific options |

### DuplicateField

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | Required | Field name to compare |
| `weight` | `number` | `1` | Relative influence of the field |

### Understanding Duplicate Results

`findDuplicates()` returns a `DuplicateResult` object.

```typescript
{
  duplicateGroups: [],
  uniqueRecords: [],
  totalRecords: 0,
  duplicateGroupsCount: 0,
  duplicateRecordsCount: 0,
  uniqueRecordsCount: 0,
}
```

Each duplicate group contains:

- `groupId`: Unique identifier for the group.
- `records`: Original records belonging to the group.
- `duplicatePairs`: Pairwise duplicate comparisons within the group.

Each duplicate pair contains:

- `firstRecordIndex`: Index of the first record in the input dataset.
- `secondRecordIndex`: Index of the second record.
- `score`: Combined similarity score.
- `fieldScores`: Individual field comparison scores.

### Duplicate Grouping

Duplicate groups are formed using connected relationships between records.

For example, if record A matches B and record B matches C, all three records belong to the same duplicate group, even if A and C do not directly match.

`uniqueRecords` contains records that do not belong to any detected duplicate group.

**Performance note:** Duplicate detection compares records pairwise. Its comparison cost grows approximately quadratically with the dataset size.

---

## CSV Deduplication

Use `findDuplicatesCSV()` to detect duplicate records directly from CSV text.

```typescript
import { findDuplicatesCSV } from "@matchforge/core";

const csv = `id,name,email
1,Rahul Sharma,rahul@gmail.com
2,Rahul S.,rahul@gmail.com
3,Pavan Kapadiya,pavan@gmail.com`;

const result = findDuplicatesCSV(csv, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  method: "jaro-winkler",
  threshold: 0.85,
});

console.log(result.duplicateGroups);
console.log(result.uniqueRecords);
console.log(result.headers);
console.log(result.parseErrors);
```

The result extends the regular duplicate detection result with:

| Property | Description |
|---|---|
| `records` | Original parsed CSV records |
| `headers` | Original CSV column names |
| `parseErrors` | CSV parsing errors |

### Exporting a Clean CSV

Use `exportUniqueCSV()` to export a CSV containing the records you want to retain.

```typescript
import {
  findDuplicatesCSV,
  exportUniqueCSV,
} from "@matchforge/core";

const result = findDuplicatesCSV(csv, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  threshold: 0.85,
});

const cleanCSV = exportUniqueCSV(result);

console.log(cleanCSV);
```

By default, the export uses the `most-complete` strategy.

### UniqueCSVExportOptions

The `keep` option controls which records are retained from duplicate groups.

| Strategy | Behaviour |
|---|---|
| `first` | Keeps the first record in each duplicate group |
| `most-complete` | Keeps the record with the most populated fields |
| `exclude` | Removes every record belonging to a duplicate group |

#### Keep the first record

```typescript
const cleanCSV = exportUniqueCSV(result, {
  keep: "first",
});
```

#### Keep the most complete record

```typescript
const cleanCSV = exportUniqueCSV(result, {
  keep: "most-complete",
});
```

This strategy counts non-empty fields in each record and retains the record with the highest count.

If multiple records have the same count, the first record is retained.

#### Exclude all duplicate records

```typescript
const cleanCSV = exportUniqueCSV(result, {
  keep: "exclude",
});
```

This removes every record belonging to a duplicate group. Records without duplicates are still retained.

**Important:** `most-complete` compares the number of populated fields, not the length or quality of individual values. All fields currently have equal importance.

The exported CSV preserves the original column headers and the relative order of retained records.

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

Soundex and Metaphone also expose their encoding functions in addition to their similarity functions.

---

## TypeScript Support

MatchForge Core is written in TypeScript and includes declaration files.

Public types can be imported directly:

```typescript
import {
  type SimilarityMethod,
  type NormalizeOptions,
  type QGramOptions,
  type CompareOptions,
  type MatchingOptions,
  type MatchingResult,
  type DuplicateOptions,
  type DuplicateResult,
  type DuplicateCSVResult,
  type UniqueCSVExportOptions,
} from "@matchforge/core";
```

Additional exported types include:

- `MatchingField`
- `FieldMatchScore`
- `MatchCandidate`
- `RecordMatch`
- `CSVParseOptions`
- `CSVParseError`
- `CSVParseResult`
- `CSVRecord`
- `CSVMatchOptions`
- `CSVMatchCandidate`
- `CSVRecordMatch`
- `CSVUnmatchedRecord`
- `CSVMatchResult`
- `CSVExportOptions`
- `DuplicateField`
- `DuplicatePair`
- `DuplicateGroup`

---

## License

MatchForge Core is released under the [MIT License](LICENSE).