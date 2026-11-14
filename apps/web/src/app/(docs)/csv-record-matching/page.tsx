import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Database,
  FileSpreadsheet,
  GitCompareArrows,
  Scale,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const basicExample = `import {
  matchCSV,
  exportMatches,
} from "@matchforge/core";

const sourceCSV = \`name,city
Rahul Sharma,Ahmedabad
Priya Patel,Surat
Amit Shah,Vadodara\`;

const targetCSV = \`full_name,location
Rahul S Sharma,Ahmedabad
Priya P Patel,Surat
Amit Shah,Vadodara\`;

const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "full_name" },
    { sourceKey: "city", targetKey: "location" },
  ],
});

console.log(result.matches);

const csv = exportMatches(result);`;

const mappingExample = `const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    {
      sourceKey: "name",
      targetKey: "full_name",
      weight: 0.7,
    },
    {
      sourceKey: "city",
      targetKey: "location",
      weight: 0.3,
    },
  ],
});`;

const configurationExample = `const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "full_name" },
    { sourceKey: "city", targetKey: "location" },
  ],
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 3,
  normalization: {
    lowercase: true,
    trim: true,
    removeAccents: true,
  },
});`;

const parsingExample = `const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "full_name" },
  ],
  sourceParseOptions: {
    delimiter: ";",
    skipEmptyLines: true,
  },
  targetParseOptions: {
    delimiter: ",",
    skipEmptyLines: true,
  },
});

console.log(result.parseErrors);`;

const exportExample = `import {
  matchCSV,
  exportMatches,
} from "@matchforge/core";

const result = matchCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "full_name" },
  ],
});

const outputCSV = exportMatches(result);

// Use a custom delimiter
const tabSeparated = exportMatches(result, {
  delimiter: "\\t",
});`;

const methods = [
  "levenshtein",
  "damerau-levenshtein",
  "jaro",
  "jaro-winkler",
  "jaccard",
  "dice",
  "cosine",
  "soundex",
  "metaphone",
];

const matchingOptions = [
  {
    name: "fields",
    defaultValue: "Required",
    description:
      "Maps source columns to target columns. Each field accepts sourceKey, targetKey, and an optional weight.",
  },
  {
    name: "method",
    defaultValue: "jaro-winkler",
    description: "Similarity algorithm used to compare mapped values.",
  },
  {
    name: "threshold",
    defaultValue: "0.7",
    description:
      "Minimum overall similarity score required for a candidate. Must be between 0 and 1.",
  },
  {
    name: "topK",
    defaultValue: "1",
    description:
      "Maximum number of qualifying candidates returned for each source record. Must be a positive integer.",
  },
  {
    name: "normalization",
    defaultValue: "{}",
    description:
      "Preprocessing options applied before comparing string values.",
  },
  {
    name: "algorithmOptions",
    defaultValue: "{}",
    description:
      "Additional configuration for supported similarity algorithms.",
  },
];

const parsingOptions = [
  {
    name: "delimiter",
    defaultValue: "Auto",
    description: "Character used to separate CSV columns.",
  },
  {
    name: "skipEmptyLines",
    defaultValue: "true",
    description: "Skips empty lines. Can also be set to greedy.",
  },
];

const resultProperties = [
  ["matches", "Matching results for each source record."],
  ["unmatched", "Source records without qualifying candidates."],
  ["totalSourceRecords", "Number of parsed source records."],
  ["totalTargetRecords", "Number of parsed target records."],
  ["sourceHeaders", "Headers detected in the source CSV."],
  ["targetHeaders", "Headers detected in the target CSV."],
  ["parseErrors", "Parsing errors from both CSV inputs."],
];

export default function CSVRecordMatchingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileSpreadsheet className="size-4 text-primary" />
            DATASET MATCHING
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            CSV Record Matching
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Find corresponding records across two CSV datasets using
            configurable field mapping and string similarity algorithms.
            MatchForge handles CSV parsing, candidate scoring, ranking, and
            result export through a simple API.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/csv-record-matching/playground"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open playground
              <ArrowUpRight className="size-4" />
            </Link>

            <a
              href="#basic-usage"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Explore documentation
              <ArrowRight className="size-4 text-muted-foreground" />
            </a>
          </div>

          <div className="my-10 border-t border-border" />

          <section id="overview" className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              What is CSV record matching?
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              CSV record matching identifies similar records across two
              datasets. Instead of requiring exact equality, MatchForge compares
              selected columns using string similarity algorithms. This is
              useful when datasets contain spelling differences, inconsistent
              formatting, or different column names.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Source CSV</h3>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Records you want to find matches for.
                </p>

                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <div className="grid grid-cols-2 bg-muted/60 px-3 py-2 text-[10px] font-semibold">
                    <span>name</span>
                    <span>city</span>
                  </div>
                  {[
                    ["Rahul Sharma", "Ahmedabad"],
                    ["Priya Patel", "Surat"],
                  ].map((row) => (
                    <div
                      key={row[0]}
                      className="grid grid-cols-2 border-t border-border px-3 py-2 text-[10px]"
                    >
                      <span>{row[0]}</span>
                      <span className="text-muted-foreground">{row[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Target CSV</h3>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Dataset containing potential matches.
                </p>

                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <div className="grid grid-cols-2 bg-muted/60 px-3 py-2 text-[10px] font-semibold">
                    <span>full_name</span>
                    <span>location</span>
                  </div>
                  {[
                    ["Rahul S Sharma", "Ahmedabad"],
                    ["Priya P Patel", "Surat"],
                  ].map((row) => (
                    <div
                      key={row[0]}
                      className="grid grid-cols-2 border-t border-border px-3 py-2 text-[10px]"
                    >
                      <span>{row[0]}</span>
                      <span className="text-muted-foreground">{row[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              How it works
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge parses both CSV inputs, compares mapped columns,
              calculates a weighted score for each candidate, and returns the
              best qualifying candidates.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  icon: FileSpreadsheet,
                  title: "01. Parse CSV files",
                  description:
                    "Read headers and records from both CSV datasets.",
                },
                {
                  icon: GitCompareArrows,
                  title: "02. Map and compare fields",
                  description:
                    "Compare corresponding columns using the selected similarity method.",
                },
                {
                  icon: Scale,
                  title: "03. Calculate weighted scores",
                  description:
                    "Combine individual field scores using their configured weights.",
                },
                {
                  icon: Check,
                  title: "04. Rank candidates",
                  description:
                    "Filter candidates by threshold, sort by score, and return the top K.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <step.icon className="size-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs leading-6 text-muted-foreground">
                Each source record is compared independently against the target
                dataset. A target record can therefore appear as a candidate for
                multiple source records. This is not a one-to-one assignment
                algorithm.
              </p>
            </div>
          </section>

          <section id="basic-usage" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Pass the contents of two CSV files to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                matchCSV()
              </code>{" "}
              and specify which columns should be compared. The first row of
              each CSV is treated as its header.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The returned result includes candidate matches, unmatched source
              records, record counts, detected headers, and parsing errors.
            </p>
          </section>

          <section id="field-mapping" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Field mapping and weights
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Different datasets may use different names for the same
              information. Use{" "}
              <code className="text-foreground">sourceKey</code> and{" "}
              <code className="text-foreground">targetKey</code> to map
              corresponding columns.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 bg-muted/50 px-4 py-3 text-xs font-medium">
                <span>Source</span>
                <span />
                <span>Target</span>
                <span>Weight</span>
              </div>

              {[
                ["name", "full_name", "0.7"],
                ["city", "location", "0.3"],
              ].map(([source, target, weight]) => (
                <div
                  key={source}
                  className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 border-t border-border px-4 py-3"
                >
                  <code className="text-xs">{source}</code>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <code className="text-xs">{target}</code>
                  <span className="text-xs text-muted-foreground">
                    {weight}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <CodeBlock code={mappingExample} language="typescript" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Each field has an optional weight. Fields without a weight use 1.
              MatchForge calculates the weighted average using available field
              scores. Missing, null, and empty values are skipped. Fields with a
              weight of zero are also skipped.
            </p>
          </section>

          <section id="configuration" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Matching configuration
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Configure the similarity algorithm, minimum score, candidate
              limit, and preprocessing behavior.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Option</th>
                    <th className="px-3 py-3 font-medium">Default</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {matchingOptions.map((option) => (
                    <tr key={option.name}>
                      <td className="px-3 py-3 align-top">
                        <code className="text-xs font-medium">
                          {option.name}
                        </code>
                      </td>
                      <td className="px-3 py-3 align-top font-mono text-xs text-muted-foreground">
                        {option.defaultValue}
                      </td>
                      <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <CodeBlock code={configurationExample} language="typescript" />
            </div>

            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs leading-6 text-muted-foreground">
                The default method is{" "}
                <code className="text-foreground">jaro-winkler</code>, the
                default threshold is{" "}
                <code className="text-foreground">0.7</code>, and the default
                topK is <code className="text-foreground">1</code>. Threshold
                must be between 0 and 1, and topK must be a positive integer.
              </p>
            </div>
          </section>

          <section id="similarity-methods" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Supported similarity methods
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Choose one similarity algorithm for the mapped fields in a
              matching operation.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {methods.map((method) => (
                <div
                  key={method}
                  className="rounded-lg border border-border px-3 py-2.5"
                >
                  <code className="text-xs">{method}</code>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Jaccard and Dice use q-gram similarity. Additional q-gram
              configuration can be supplied through{" "}
              <code className="text-foreground">algorithmOptions</code>.
            </p>
          </section>

          <section id="csv-options" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              CSV parsing options
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Configure parsing independently for both inputs using{" "}
              <code className="text-foreground">sourceParseOptions</code> and{" "}
              <code className="text-foreground">targetParseOptions</code>.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Option</th>
                    <th className="px-3 py-3 font-medium">Default</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsingOptions.map((option) => (
                    <tr key={option.name}>
                      <td className="px-3 py-3 align-top">
                        <code className="text-xs">{option.name}</code>
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-muted-foreground">
                        {option.defaultValue}
                      </td>
                      <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <CodeBlock code={parsingExample} language="typescript" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              CSV values are parsed as strings. Parsing errors are available
              separately under{" "}
              <code className="text-foreground">result.parseErrors.source</code>{" "}
              and{" "}
              <code className="text-foreground">result.parseErrors.target</code>
              .
            </p>
          </section>

          <section id="results" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Understanding the results
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Each source record has a result containing its original data,
              record number, qualifying candidates, and match status.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Property</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {resultProperties.map(([name, description]) => (
                    <tr key={name}>
                      <td className="px-3 py-3 align-top">
                        <code className="text-xs">{name}</code>
                      </td>
                      <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-7 text-sm font-semibold">
              Candidate information
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Each candidate contains the target record, target record number,
              overall similarity score, selected method, and individual field
              scores.
            </p>

            <div className="mt-4 rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground">
                EXAMPLE CANDIDATE
              </p>

              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Target record", "2"],
                  ["Score", "0.92"],
                  ["Method", "jaro-winkler"],
                  ["Matched", "true"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="mt-1 break-all font-mono text-xs">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Record numbers are one-based positions in the parsed records,
              excluding the header row. A source record is matched when at least
              one candidate meets the threshold.
            </p>
          </section>

          <section id="export" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Export matching results
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use <code className="text-foreground">exportMatches()</code> to
              convert matching results into a CSV string. The exported data
              includes record numbers, match status, score, method, and the
              original source and target fields.
            </p>

            <div className="mt-5">
              <CodeBlock code={exportExample} language="typescript" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The output delimiter can be customized through the optional export
              options object. The default delimiter is a comma.
            </p>
          </section>

          <section id="best-practices" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Best practices
            </h2>

            <div className="mt-5 space-y-4">
              {[
                [
                  "Choose informative fields",
                  "Use columns that help distinguish records, such as names, email addresses, or locations.",
                ],
                [
                  "Set meaningful weights",
                  "Give greater weight to fields that are more reliable for identifying the same entity.",
                ],
                [
                  "Tune the threshold",
                  "A higher threshold is more restrictive, while a lower threshold allows more candidates.",
                ],
                [
                  "Inspect multiple candidates",
                  "Increase topK when you want to review several possible matches for each source record.",
                ],
              ].map(([title, description]) => (
                <div key={title} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Try it yourself
              </span>
            </div>

            <h2 className="mt-3 text-lg font-semibold">
              Explore CSV Record Matching
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload two datasets, map their columns, configure matching, and
              inspect the results in the interactive playground.
            </p>

            <Link
              href="/csv-record-matching/playground"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open playground
              <ArrowUpRight className="size-4" />
            </Link>
          </section>

          <div className="mt-14">
            <p className="text-xs text-muted-foreground">NEXT</p>

            <Link
              href="/api-reference"
              className="group mt-3 flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
            >
              <div>
                <p className="text-sm font-semibold">API reference</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore exported functions, options, and types.
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold">ON THIS PAGE</p>

            <nav className="space-y-3 border-l border-border pl-4">
              {[
                ["Overview", "#overview"],
                ["How it works", "#how-it-works"],
                ["Basic usage", "#basic-usage"],
                ["Field mapping", "#field-mapping"],
                ["Configuration", "#configuration"],
                ["Similarity methods", "#similarity-methods"],
                ["CSV options", "#csv-options"],
                ["Results", "#results"],
                ["Export", "#export"],
                ["Best practices", "#best-practices"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </nav>

            <Link
              href="/csv-record-matching/playground"
              className="group mt-8 block rounded-xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Try CSV Record Matching
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Compare CSV datasets, map fields, and inspect matching results.
              </p>

              <p className="mt-4 text-xs font-medium text-primary">
                Open Playground
              </p>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
