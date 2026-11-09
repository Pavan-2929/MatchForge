# ⚡ MatchForge Core

**Smarter String Matching. Better Entity Resolution.**

A modular TypeScript library for string similarity and entity matching, featuring reusable algorithms, configurable text preprocessing, and a flexible record-matching engine.

## ✨ Features

### String Similarity
- **Levenshtein & Damerau-Levenshtein** – Edit-distance-based similarity.
- **Jaro & Jaro-Winkler** – Character matching and transposition-based similarity.
- **Jaccard & Dice** – Set-based similarity using character q-grams.
- **Cosine Similarity** – Vector-based similarity using q-gram frequencies.
- **Soundex & Metaphone** – Phonetic encoding for name matching.

### Text Preprocessing
- Lowercase conversion and whitespace normalization.
- Optional punctuation removal.
- Optional accent removal.
- Configurable normalization options.

### Record Matching Engine
- Match records across two datasets.
- Configure source and target fields.
- Select from supported similarity algorithms.
- Apply configurable similarity thresholds.
- Retrieve and rank top-K candidates.
- Identify unmatched records.
- Configure q-gram size for Jaccard, Dice, and Cosine.
- Apply preprocessing during matching.

## 🛠️ Tech Stack

- TypeScript
- Node.js
- Vitest
- tsup

## 📁 Project Structure

```text
src/
├── preprocessing/   # Text normalization
├── similarity/      # Similarity algorithms
├── matching/        # Matching engine and registry
├── types/           # Shared TypeScript types
└── index.ts         # Public API

tests/               # Unit tests
dist/                # Compiled output
```

## 🚀 Development

Run these commands from the `packages/core` directory.

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## 🗺️ Roadmap

- Algorithm evaluation and benchmarking
- Schema matching
- CSV-based matching workflows
- Matching explanations and visualization

## 📄 License

[MIT](LICENSE)