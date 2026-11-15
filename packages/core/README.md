# MatchForge Core

**Smarter String Matching. Better Entity Resolution.**

MatchForge Core is a framework-independent TypeScript library for string similarity, record matching, candidate generation, dataset deduplication, and evaluation.

It provides nine similarity algorithms, configurable text preprocessing, weighted multi-field matching, CSV utilities, blocking strategies, and evaluation metrics for measuring matching and blocking quality.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Algorithms](#supported-algorithms)
- [Text Preprocessing](#text-preprocessing)
- [String Comparison](#string-comparison)
- [Record Matching](#record-matching)
  - [Single-field Matching](#single-field-matching)
  - [Multi-field Matching](#multi-field-matching)
  - [Blocking Integration](#blocking-integration)
  - [Matching Options](#matchingoptions)
  - [Understanding the Result](#understanding-the-result)
- [Blocking and Candidate Generation](#blocking-and-candidate-generation)
  - [Blocking Methods](#blocking-methods)
  - [Generating Candidates](#generating-candidates)
  - [Candidate Generation Result](#candidate-generation-result)
- [CSV Utilities](#csv-utilities)
  - [Parsing CSV](#parsing-csv)
  - [Matching CSV Datasets](#matching-csv-datasets)
  - [Exporting Matching Results](#exporting-matching-results)
- [Dataset Deduplication](#dataset-deduplication)
  - [Blocking Integration](#blocking-integration-1)
  - [Understanding Duplicate Results](#understanding-duplicate-results)
- [CSV Deduplication](#csv-deduplication)
- [Matching Evaluation](#matching-evaluation)
- [Blocking Evaluation](#blocking-evaluation)
- [CSV Evaluation](#csv-evaluation)
  - [CSV Matching Evaluation](#csv-matching-evaluation)
  - [CSV Blocking Evaluation](#csv-blocking-evaluation)
- [Direct Algorithm Functions](#direct-algorithm-functions)
- [TypeScript Support](#typescript-support)
- [License](#license)

---

## Features

### String Similarity

- Nine similarity algorithms.
- Edit-distance, character-based, q-gram, and phonetic comparisons.
- Similarity scores between `0` and `1`.

### Text Preprocessing

- Lowercase conversion.
- Whitespace trimming and normalization.
- Optional punctuation removal.
- Optional accent and diacritic removal.

### Record Matching

- Match records across two datasets.
- Single-field and multi-field matching.
- Weighted field comparisons.
- Configurable similarity methods and thresholds.
- Top-K candidate selection.
- Field-level similarity scores.
- Optional blocking to reduce the number of record pairs sent to similarity scoring.

### Blocking and Candidate Generation

- Generate candidate pairs before similarity comparison.
- Exact, prefix, and Soundex blocking methods.
- Multiple blocking rules combined using union (OR) semantics.
- Configurable prefix length and text normalization.
- Candidate-pair counts and reduction statistics.
- Blocking integration with record matching and dataset deduplication.

### Matching Evaluation

- Evaluate matching predictions against labelled ground truth.
- Confusion matrix: true positives, false positives, false negatives, and true negatives.
- Precision, recall, F1-score, and accuracy.
- Evaluation of explicitly labelled pairs only.

### Blocking Evaluation

- Measure how many known matching pairs survive candidate generation.
- Candidate recall and candidate precision.
- Reduction ratio and supporting pair counts.
- Evaluation against explicitly labelled ground-truth pairs.

### CSV Utilities

- Parse CSV text into JavaScript records.
- Match records directly from two CSV datasets.
- Export matching results as CSV.
- Preserve original column information and record numbers.
- Access CSV parsing errors.

### Dataset Deduplication

- Detect duplicates within a single dataset.
- Support multiple matching fields and weights.
- Group connected duplicate records.
- Retrieve duplicate pairs and similarity scores.
- Identify unique records.
- Optionally use blocking to reduce pairwise comparisons.

### CSV Deduplication and Evaluation

- Detect duplicates directly from CSV text.
- Export cleaned CSV data.
- Choose which records to retain using different strategies.
- Evaluate matching and blocking directly from two CSV inputs.

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

### Generate candidates using blocking

```typescript
import { generateCandidates } from "@matchforge/core";

const source = [
  { name: "Rahul Sharma" },
  { name: "Amit Patel" },
];

const target = [
  { fullName: "Rahul Sharma" },
  { fullName: "Rahul Verma" },
  { fullName: "Pavan Kapadiya" },
];

const result = generateCandidates(source, target, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
  ],
});

console.log(result.pairs);
console.log(result.stats);
```

### Evaluate matching predictions

```typescript
import { matchRecords, evaluateMatches } from "@matchforge/core";

const predictions = matchRecords(source, target, {
  sourceKey: "name",
  targetKey: "fullName",
  threshold: 0.8,
});

const evaluation = evaluateMatches({
  predictions,
  groundTruth: [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 0, targetIndex: 1, isMatch: false },
  ],
});

console.log(evaluation.metrics);
console.log(evaluation.confusionMatrix);
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

`compareStrings()`, `matchRecords()`, blocking, and deduplication can use normalization through their `normalization` options.

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

### Blocking Integration

For large datasets, comparing every source record against every target record can require many similarity calculations. Blocking reduces the number of target records considered for each source record.

Pass a `blocking` configuration to `matchRecords()`. Candidate generation runs first; similarity scoring is then performed only on the generated candidate pairs.

```typescript
const result = matchRecords(source, target, {
  fields: [
    { sourceKey: "name", targetKey: "fullName", weight: 0.7 },
    { sourceKey: "city", targetKey: "location", weight: 0.3 },
  ],
  threshold: 0.75,
  topK: 2,
  blocking: {
    rules: [
      {
        sourceKey: "name",
        targetKey: "fullName",
        method: "prefix",
        length: 3,
      },
      {
        sourceKey: "city",
        targetKey: "location",
        method: "exact",
      },
    ],
  },
});
```

Multiple blocking rules use **OR (union) semantics**: a source-target pair is retained as a candidate if it satisfies at least one rule.

Blocking is a candidate-generation step, not a matching decision. A generated candidate must still pass the configured similarity threshold to appear in the matching result.

See [Blocking and Candidate Generation](#blocking-and-candidate-generation) for the available methods and configuration.

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
| `blocking` | `BlockingOptions` | — | Optional candidate-generation configuration |

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
- `sourceIndex`: Original index of the source record in the input dataset.
- `candidates`: Ranked target candidates.
- `matched`: Whether at least one candidate met the threshold.

Each candidate contains:

- `record`: Target record.
- `targetIndex`: Original index of the target record in the input dataset.
- `score`: Combined similarity score.
- `method`: Similarity algorithm used.
- `fieldScores`: Individual field comparison results.

`unmatched` contains source records for which no candidate met the threshold.

Target records are not reserved or consumed. The same target record can match multiple source records.

---

## Blocking and Candidate Generation

Blocking is used to reduce the number of record pairs that need expensive similarity comparisons.

Instead of comparing every source record with every target record, blocking groups records using selected key-generation rules and produces a smaller set of candidate pairs.

Use `generateCandidates()` when you need candidate pairs directly, or configure blocking inside `matchRecords()` and `findDuplicates()`.

### Blocking Methods

MatchForge supports three blocking methods:

| Method | Description | Configuration |
|---|---|---|
| `exact` | Compares normalized field values for exact equality | No additional option |
| `prefix` | Compares the first characters of normalized field values | Optional `length`; defaults to `3` |
| `soundex` | Compares generated Soundex phonetic codes | No additional option |

All methods can use the `normalization` option.

For prefix blocking, `length` must be a positive integer.

Missing, null, empty, or normalized-to-empty values do not generate blocking keys. Blocking field values must otherwise be strings.

### Generating Candidates

Use `generateCandidates()` to generate candidate pairs between two datasets.

```typescript
import { generateCandidates } from "@matchforge/core";

const source = [
  { name: "Rahul Sharma" },
  { name: "Amit Patel" },
  { name: "Pavan Kapadiya" },
];

const target = [
  { fullName: "Rahul Sharma" },
  { fullName: "Rahul Verma" },
  { fullName: "Amit Patel" },
];

const result = generateCandidates(source, target, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "exact",
    },
  ],
});

console.log(result.pairs);
console.log(result.stats);
```

### BlockingOptions

| Option | Type | Description |
|---|---|---|
| `rules` | `BlockingRule[]` | One or more candidate-generation rules; at least one is required |
| `normalization` | `NormalizeOptions` | Optional text normalization applied before generating blocking keys |

### BlockingRule

| Property | Type | Description |
|---|---|---|
| `sourceKey` | `string` | Field name in the source record |
| `targetKey` | `string` | Field name in the target record |
| `method` | `BlockingMethod` | `exact`, `prefix`, or `soundex` |
| `length` | `number` | Prefix length; applies only to `prefix` and defaults to `3` |

### Multiple Blocking Rules

Multiple rules are combined using union (OR) semantics.

```typescript
const result = generateCandidates(source, target, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
    {
      sourceKey: "email",
      targetKey: "email",
      method: "exact",
    },
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "soundex",
    },
  ],
});
```

A pair generated by more than one rule appears only once in `pairs`.

### Candidate Generation Result

`generateCandidates()` returns a `CandidateGenerationResult`:

```typescript
{
  pairs: [
    { sourceIndex: 0, targetIndex: 1 },
  ],
  stats: {
    totalSourceRecords: 100,
    totalTargetRecords: 120,
    totalPossiblePairs: 12000,
    candidatePairs: 1500,
    reductionPercentage: 87.5,
  },
}
```

The example values above are illustrative.

Each candidate pair contains:

- `sourceIndex`: Index of the source record.
- `targetIndex`: Index of the target record.

The `stats` object contains:

| Property | Description |
|---|---|
| `totalSourceRecords` | Number of source records supplied |
| `totalTargetRecords` | Number of target records supplied |
| `totalPossiblePairs` | Source record count multiplied by target record count |
| `candidatePairs` | Number of unique generated candidate pairs |
| `reductionPercentage` | Percentage of possible pairs removed by blocking, from `0` to `100` |

The reduction percentage is `0` when there are no possible pairs.

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

Blocking can also be supplied through the matching options passed to `matchCSV()`.

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
| `blocking` | `DuplicateBlockingOptions` | — | Optional candidate-generation configuration |

### DuplicateField

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | Required | Field name to compare |
| `weight` | `number` | `1` | Relative influence of the field |

### Blocking Integration

For larger datasets, optional blocking can reduce the number of record pairs that need similarity comparisons.

Unlike cross-dataset blocking rules, duplicate blocking uses one field key because records are compared against other records in the same dataset.

```typescript
const result = findDuplicates(customers, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  threshold: 0.85,
  blocking: {
    rules: [
      {
        key: "name",
        method: "prefix",
        length: 3,
      },
      {
        key: "email",
        method: "exact",
      },
    ],
  },
});
```

Multiple duplicate-blocking rules also use union (OR) semantics. A record pair is considered for similarity scoring if it is generated by at least one rule.

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

**Performance note:** Without blocking, duplicate detection compares records pairwise. Its comparison cost grows approximately quadratically with the dataset size. Blocking can reduce the number of pairs sent to similarity scoring, but its effectiveness depends on the selected rules and data.

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

The same duplicate blocking configuration can be supplied through the `blocking` option.

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

## Matching Evaluation

Use `evaluateMatches()` to measure the quality of matching predictions against labelled ground truth.

The evaluator accepts the result of `matchRecords()` and a list of labelled source-target pairs.

### GroundTruthPair

Each ground-truth pair identifies a source record, a target record, and whether the pair represents a true match.

```typescript
const groundTruth = [
  { sourceIndex: 0, targetIndex: 0, isMatch: true },
  { sourceIndex: 0, targetIndex: 1, isMatch: false },
  { sourceIndex: 1, targetIndex: 0, isMatch: false },
  { sourceIndex: 1, targetIndex: 1, isMatch: true },
];
```

Indexes are zero-based indexes into the original source and target datasets.

### Evaluating Matching Results

```typescript
import { matchRecords, evaluateMatches } from "@matchforge/core";

const predictions = matchRecords(source, target, {
  sourceKey: "name",
  targetKey: "fullName",
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 1,
});

const evaluation = evaluateMatches({
  predictions,
  groundTruth,
});

console.log(evaluation.confusionMatrix);
console.log(evaluation.metrics);
```

### EvaluationOptions

| Option | Type | Description |
|---|---|---|
| `predictions` | `MatchingResult` | Matching output returned by `matchRecords()` |
| `groundTruth` | `GroundTruthPair[]` | Labelled source-target pairs used for evaluation |

### Confusion Matrix

The evaluator compares the predicted candidate pairs with the explicitly labelled pairs.

| Outcome | Meaning |
|---|---|
| True Positive (TP) | A labelled match that was predicted |
| False Positive (FP) | A labelled non-match that was predicted |
| False Negative (FN) | A labelled match that was not predicted |
| True Negative (TN) | A labelled non-match that was not predicted |

### Evaluation Metrics

| Metric | Description |
|---|---|
| Precision | Proportion of predicted labelled matches that are correct |
| Recall | Proportion of labelled true matches that were predicted |
| F1-score | Harmonic mean of precision and recall |
| Accuracy | Proportion of correctly predicted labelled pairs |

All metrics are returned as decimal values between `0` and `1`. When a metric's denominator is zero, the implementation returns `0`.

**Important:** Only explicitly labelled ground-truth pairs are evaluated. Unlabelled pairs are not assumed to be non-matches. A genuine pair that is absent from the matching candidates is counted as a false negative if it is labelled as a match.

The matching evaluator considers the candidates returned by `matchRecords()`. Therefore, the matching threshold and `topK` settings affect the predictions being evaluated.

### EvaluationResult

The result contains:

```typescript
{
  confusionMatrix: {
    truePositives: 0,
    falsePositives: 0,
    falseNegatives: 0,
    trueNegatives: 0,
  },
  metrics: {
    precision: 0,
    recall: 0,
    f1Score: 0,
    accuracy: 0,
  },
  totalEvaluatedPairs: 0,
}
```

---

## Blocking Evaluation

Use `evaluateBlocking()` to measure the quality of a candidate-generation strategy before applying similarity-based matching.

Blocking evaluation compares generated candidate pairs with labelled ground truth. It helps determine whether blocking removes enough comparisons while retaining genuine matching pairs.

### Evaluating Candidate Generation

```typescript
import {
  generateCandidates,
  evaluateBlocking,
} from "@matchforge/core";

const candidates = generateCandidates(source, target, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
  ],
});

const evaluation = evaluateBlocking({
  candidates,
  groundTruth,
});

console.log(evaluation.metrics);
console.log(evaluation.totalCandidatePairs);
```

### BlockingEvaluationOptions

| Option | Type | Description |
|---|---|---|
| `candidates` | `CandidateGenerationResult` | Output returned by `generateCandidates()` |
| `groundTruth` | `GroundTruthPair[]` | Labelled source-target pairs used for evaluation |

### Blocking Evaluation Metrics

| Metric | Description |
|---|---|
| Candidate Recall | Fraction of all labelled true pairs retained by blocking |
| Candidate Precision | Fraction of labelled candidate pairs that are true matches |
| Reduction Ratio | Fraction of all possible pairs eliminated by blocking |

The metrics are returned as decimal values between `0` and `1`.

Conceptually:

- **Candidate Recall** = true candidate pairs / all labelled true pairs.
- **Candidate Precision** = true candidate pairs / labelled candidate pairs.
- **Reduction Ratio** = 1 − candidate pairs / total possible pairs.

When a denominator is zero, the corresponding metric is `0`.

**Important:** Candidate precision is calculated using labelled candidate pairs. Unlabelled candidate pairs are not automatically treated as false positives. With sparse ground truth, candidate precision may not represent the precision across every generated candidate pair.

### BlockingEvaluationResult

The result contains:

| Property | Description |
|---|---|
| `metrics` | Candidate recall, candidate precision, and reduction ratio |
| `totalPossiblePairs` | Total possible source-target combinations |
| `totalCandidatePairs` | Number of generated candidate pairs |
| `totalEvaluatedPairs` | Number of ground-truth pairs supplied |
| `totalLabelledCandidatePairs` | Number of labelled pairs that were generated as candidates |
| `trueCandidatePairs` | Number of labelled true matches retained as candidates |
| `totalTruePairs` | Number of labelled true matches |

Blocking evaluation is useful for comparing blocking configurations before choosing one for a matching workflow.

---

## CSV Evaluation

MatchForge provides CSV wrappers for both matching evaluation and blocking evaluation. These functions parse the input CSV datasets, run the corresponding existing record-level workflow, evaluate the results, and return CSV metadata.

Both functions accept separate parsing options for the source and target CSV inputs.

### CSV Matching Evaluation

Use `evaluateMatchesCSV()` to evaluate matching predictions directly from two CSV strings.

```typescript
import { evaluateMatchesCSV } from "@matchforge/core";

const sourceCSV = `name
Rahul Sharma
Amit Patel`;

const targetCSV = `fullName
Rahul Sharma
Amit Shah`;

const result = evaluateMatchesCSV(sourceCSV, targetCSV, {
  sourceKey: "name",
  targetKey: "fullName",
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 1,
  groundTruth: [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 0, targetIndex: 1, isMatch: false },
    { sourceIndex: 1, targetIndex: 0, isMatch: false },
    { sourceIndex: 1, targetIndex: 1, isMatch: false },
  ],
});

console.log(result.metrics);
console.log(result.confusionMatrix);
console.log(result.sourceHeaders);
console.log(result.targetHeaders);
console.log(result.parseErrors);
```

`evaluateMatchesCSV()` uses the same matching configuration as `matchRecords()`, with the following additional options:

| Option | Type | Description |
|---|---|---|
| `groundTruth` | `GroundTruthPair[]` | Labelled source-target pairs used for evaluation |
| `sourceParseOptions` | `CSVParseOptions` | Parsing configuration for the source CSV |
| `targetParseOptions` | `CSVParseOptions` | Parsing configuration for the target CSV |

The result includes the complete `EvaluationResult` plus:

- `sourceHeaders`: Source CSV column names.
- `targetHeaders`: Target CSV column names.
- `parseErrors`: Parsing errors for the source and target CSV inputs.

### CSV Blocking Evaluation

Use `evaluateBlockingCSV()` to evaluate candidate generation directly from two CSV strings.

```typescript
import { evaluateBlockingCSV } from "@matchforge/core";

const sourceCSV = `name
Rahul Sharma
Amit Patel`;

const targetCSV = `fullName
Rahul Sharma
Rahul Verma`;

const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
  ],
  groundTruth: [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 0, targetIndex: 1, isMatch: false },
    { sourceIndex: 1, targetIndex: 0, isMatch: false },
    { sourceIndex: 1, targetIndex: 1, isMatch: false },
  ],
});

console.log(result.metrics);
console.log(result.totalCandidatePairs);
console.log(result.sourceHeaders);
console.log(result.targetHeaders);
console.log(result.parseErrors);
```

`evaluateBlockingCSV()` uses the same blocking configuration as `generateCandidates()`, with the following additional options:

| Option | Type | Description |
|---|---|---|
| `groundTruth` | `GroundTruthPair[]` | Labelled source-target pairs used for evaluation |
| `sourceParseOptions` | `CSVParseOptions` | Parsing configuration for the source CSV |
| `targetParseOptions` | `CSVParseOptions` | Parsing configuration for the target CSV |

The result includes the complete `BlockingEvaluationResult` plus:

- `sourceHeaders`: Source CSV column names.
- `targetHeaders`: Target CSV column names.
- `parseErrors`: Parsing errors for the source and target CSV inputs.

### Ground-Truth Indexing for CSV

For both CSV evaluation wrappers, ground-truth indexes refer to the parsed data records:

- The header row is not included.
- Indexes start at `0`.
- Empty lines skipped by the parser are not counted as records.
- Indexes are not physical line numbers in the CSV file.

For example, in this CSV:

```csv
name,email
Rahul,rahul@example.com
Amit,amit@example.com
```

The Rahul record has index `0`, and the Amit record has index `1`.

### CSV Parsing Errors

The wrappers return parser errors in `parseErrors` rather than discarding them.

```typescript
result.parseErrors.source;
result.parseErrors.target;
```

A parsing error does not automatically mean the wrapper throws an exception. The parsed records are still passed to the underlying workflow. Check the returned errors when validating CSV input quality.

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
import type {
  SimilarityMethod,
  NormalizeOptions,
  QGramOptions,
  CompareOptions,
  MatchingOptions,
  MatchingResult,
  BlockingMethod,
  BlockingRule,
  BlockingOptions,
  CandidatePair,
  CandidateGenerationStats,
  CandidateGenerationResult,
  GroundTruthPair,
  EvaluationOptions,
  ConfusionMatrix,
  EvaluationMetrics,
  EvaluationResult,
  BlockingEvaluationOptions,
  BlockingEvaluationMetrics,
  BlockingEvaluationResult,
  CSVEvaluationOptions,
  CSVEvaluationResult,
  CSVBlockingEvaluationOptions,
  CSVBlockingEvaluationResult,
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
- `DuplicateOptions`
- `DuplicatePair`
- `DuplicateGroup`
- `DuplicateResult`
- `DuplicateCSVResult`
- `UniqueCSVExportOptions`
- `DuplicateBlockingRule`
- `DuplicateBlockingOptions`

---

## License

MatchForge Core is released under the [MIT License](LICENSE).
