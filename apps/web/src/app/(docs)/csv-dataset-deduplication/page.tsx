import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  FileDown,
  GitCompareArrows,
  Layers3,
  Sparkles,
} from "lucide-react";

import { CodeBlock } from "@/components/code-block";

const basicExample = `import {
  findDuplicatesCSV,
  exportUniqueCSV,
} from "@matchforge/core";

const csv = \`name,email,city
Rahul Sharma,rahul@gmail.com,Ahmedabad
Rahul S.,rahul@gmail.com,Ahmedabad
Pavan Kapadiya,pavan@gmail.com,Surat
Amit Shah,amit@gmail.com,Vadodara\`;

const result = findDuplicatesCSV(csv, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  method: "jaro-winkler",
  threshold: 0.85,
});

console.log(result.duplicateGroups);
console.log(result.uniqueRecords);`;

const configurationExample = `const result = findDuplicatesCSV(csv, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 },
  ],
  method: "jaro-winkler",
  threshold: 0.85,
  normalization: {
    lowercase: true,
    trim: true,
    normalizeWhitespace: true,
    removeAccents: true,
  },
});`;

const parsingExample = `const result = findDuplicatesCSV(csv, {
  fields: [
    { key: "name" },
    { key: "email" },
  ],
});

console.log(result.headers);
console.log(result.records);
console.log(result.parseErrors);`;

const exportExample = `import { exportUniqueCSV } from "@matchforge/core";

const cleanedCSV = exportUniqueCSV(result, {
  keep: "most-complete",
});`;

const steps = [
  {
    icon: FileSpreadsheet,
    title: "Provide CSV data",
    description:
      "Upload or provide a CSV string containing the records you want to clean.",
  },
  {
    icon: GitCompareArrows,
    title: "Configure comparison",
    description:
      "Select columns, similarity methods, field weights, and a matching threshold.",
  },
  {
    icon: Layers3,
    title: "Detect duplicates",
    description:
      "MatchForge compares records and organizes detected duplicates into groups.",
  },
  {
    icon: FileDown,
    title: "Export clean data",
    description:
      "Choose a retention strategy and export the resulting dataset as CSV.",
  },
];

const options = [
  [
    "fields",
    "Columns used to identify duplicate records, with optional weights.",
  ],
  ["method", "Similarity algorithm used for comparing field values."],
  ["threshold", "Minimum overall similarity required to identify duplicates."],
  ["normalization", "Preprocessing applied to values before comparison."],
  ["algorithmOptions", "Additional configuration for supported algorithms."],
];

const resultProperties = [
  ["headers", "Column names extracted from the CSV."],
  ["records", "All parsed records represented as objects."],
  ["duplicateGroups", "Groups containing detected duplicate records."],
  ["uniqueRecords", "Records that do not belong to duplicate groups."],
  ["parseErrors", "CSV parsing errors returned by the parser."],
  ["totalRecords", "Total number of parsed input records."],
  ["duplicateGroupsCount", "Number of detected duplicate groups."],
  ["duplicateRecordsCount", "Number of records in duplicate groups."],
  ["uniqueRecordsCount", "Number of unique records."],
];

const exportOptions = [
  {
    value: "most-complete",
    title: "Keep most complete",
    description:
      "Retains the record with the highest number of non-empty fields from each duplicate group.",
  },
  {
    value: "first",
    title: "Keep first record",
    description:
      "Retains the first record encountered in each duplicate group.",
  },
  {
    value: "exclude",
    title: "Exclude duplicate groups",
    description:
      "Removes all records belonging to duplicate groups from the exported dataset.",
  },
];

export default function CSVDatasetDeduplicationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Hero */}
          <section>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              CSV data tools
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              CSV dataset deduplication
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Identify and remove duplicate records directly from CSV datasets.
              MatchForge parses your data, compares selected columns, groups
              similar records, and helps you export a cleaned dataset using{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
                findDuplicatesCSV()
              </code>
              .
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/csv-dataset-deduplication/playground"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                Open playground
                <ArrowUpRight className="size-4" />
              </Link>

              <a
                href="#basic-usage"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
              >
                Explore documentation
              </a>
            </div>
          </section>

          {/* Workflow */}
          <section id="how-it-works" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              How CSV deduplication works
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A simple workflow takes your CSV data through duplicate detection
              and produces a cleaned dataset.
            </p>

            <div className="relative mt-7">
              <div className="absolute bottom-8 left-5 top-8 w-px bg-border" />

              <div className="divide-y divide-border">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="group relative flex gap-5 py-5 first:pt-2 last:pb-2"
                    >
                      <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-semibold text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          <Icon className="size-[18px]" />
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="text-sm font-semibold">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Basic usage */}
          <section id="basic-usage" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Pass CSV text and deduplication options to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                findDuplicatesCSV()
              </code>
              . The function parses the CSV and runs duplicate detection on the
              resulting records.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>

            <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs leading-6 text-muted-foreground">
                Unlike object-based deduplication, you do not need to manually
                parse the CSV or convert its rows into objects. The CSV function
                handles both operations internally.
              </p>
            </div>
          </section>

          {/* Configuration */}
          <section id="configuration" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Configure deduplication
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The same comparison options available in object-based
              deduplication are supported for CSV datasets.
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Option</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {options.map(([name, description]) => (
                    <tr key={name}>
                      <td className="px-4 py-3 align-top">
                        <code className="font-medium">{name}</code>
                      </td>
                      <td className="px-4 py-3 leading-5 text-muted-foreground">
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <CodeBlock code={configurationExample} language="typescript" />
            </div>
          </section>

          {/* CSV parsing */}
          <section id="parsing" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              CSV parsing and validation
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The function automatically parses the input CSV and includes the
              extracted headers, records, and parsing errors in its result.
            </p>

            <div className="mt-5">
              <CodeBlock code={parsingExample} language="typescript" />
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                Check <code>parseErrors</code> to identify problems encountered
                while parsing the CSV. Parsing errors are returned as part of
                the result rather than being silently discarded.
              </p>
            </div>
          </section>

          {/* Results */}
          <section id="results" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Understanding results
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                findDuplicatesCSV()
              </code>{" "}
              returns the duplicate detection results together with the original
              CSV records and parsing information.
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {resultProperties.map(([name, description]) => (
                    <tr key={name}>
                      <td className="px-4 py-3 align-top">
                        <code className="font-medium">{name}</code>
                      </td>
                      <td className="px-4 py-3 leading-5 text-muted-foreground">
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Export */}
          <section id="export" className="mt-14 scroll-mt-24">
            <div className="flex items-center gap-2">
              <FileDown className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">
                Export cleaned CSV
              </h2>
            </div>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                exportUniqueCSV()
              </code>{" "}
              to generate a cleaned CSV from the deduplication result. Choose
              how records in duplicate groups should be handled.
            </p>

            <div className="mt-5 space-y-3">
              {exportOptions.map((option) => (
                <div
                  key={option.value}
                  className="group rounded-xl border border-border p-4 transition-all duration-300 hover:border-primary/40 hover:bg-accent/20"
                >
                  <h3 className="text-sm font-semibold">{option.title}</h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>

                  <code className="mt-2 inline-block rounded bg-muted px-2 py-1 text-[11px]">
                    keep: "{option.value}"
                  </code>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <CodeBlock code={exportExample} language="typescript" />
            </div>

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Records not belonging to duplicate groups are retained regardless
              of the selected option.
            </p>
          </section>

          {/* Next */}
          <div className="mt-12">
            <p className="text-xs font-semibold text-muted-foreground">NEXT</p>

            <Link
              href="/dataset-deduplication"
              className="group mt-3 flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-300 hover:border-primary/40 hover:bg-muted/30"
            >
              <div>
                <p className="text-sm font-semibold">Dataset deduplication</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore deduplication using JavaScript objects.
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </article>

        {/* Table of contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold">ON THIS PAGE</p>

            <nav className="space-y-3 border-l border-border pl-4">
              {[
                ["How it works", "#how-it-works"],
                ["Basic usage", "#basic-usage"],
                ["Configuration", "#configuration"],
                ["CSV parsing", "#parsing"],
                ["Understanding results", "#results"],
                ["Export cleaned CSV", "#export"],
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
          </div>
        </aside>
      </div>
    </main>
  );
}
