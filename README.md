# MatchForge

**An open-source TypeScript toolkit for string similarity, record matching, and entity resolution.**

MatchForge provides developers with tools to compare strings, identify duplicate records, match datasets, and evaluate matching results through a consistent and flexible API.

The project also includes an interactive documentation website with practical examples and playgrounds to explore its features.

## Features

- **String Similarity:** Multiple algorithms for measuring similarity between strings.
- **Text Preprocessing:** Normalize and prepare text before comparison.
- **Record Matching:** Identify corresponding records across datasets.
- **Dataset Deduplication:** Detect duplicate records within a dataset.
- **Blocking:** Generate candidate pairs efficiently using configurable blocking rules.
- **CSV Workflows:** Perform record matching and deduplication on CSV datasets.
- **Evaluation:** Evaluate matching quality and blocking performance using standard metrics.
- **Interactive Playground:** Experiment with algorithms and workflows directly in the browser.

## Package

The MatchForge core package is available on npm:

**[@matchforge/core](https://www.npmjs.com/package/@matchforge/core)**

Install it using:

```bash
npm install @matchforge/core
```

## Repository Structure

```text
MatchForge/
├── apps/
│   └── web/              # Documentation website
│
├── packages/
│   └── core/             # Core TypeScript package
│
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Pavan-2929/MatchForge.git
cd MatchForge
npm install
```

### Run the Documentation Website

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build the Core Package

```bash
cd packages/core
npm run build
```

## Documentation

Explore the documentation website to learn about MatchForge's algorithms, features, and workflows.

- Installation and getting started
- String similarity and preprocessing
- Record matching and dataset deduplication
- Blocking and evaluation
- Interactive playgrounds and examples

## Contributing

Contributions, suggestions, and bug reports are welcome!

Feel free to open an issue or submit a pull request through the [GitHub repository](https://github.com/Pavan-2929/MatchForge).

## License

MatchForge is open source and distributed under the MIT License. See [LICENSE](LICENSE) for details.