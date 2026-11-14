import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Database,
  FileDown,
  GitCompareArrows,
  Layers3,
  Sparkles,
  Users,
} from "lucide-react";

import { CodeBlock } from "@/components/code-block";

const basicExample = `import { findDuplicates } from "@matchforge/core";

const records = [
  { name: "Rahul Sharma", email: "rahul@gmail.com" },
  { name: "Rahul S.", email: "rahul@gmail.com" },
  { name: "Pavan Kapadiya", email: "pavan@gmail.com" },
  { name: "Amit Shah", email: "amit@gmail.com" }
];

const result = findDuplicates(records, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 }
  ],
  method: "jaro-winkler",
  threshold: 0.85
});

console.log(result.duplicateGroups);
console.log(result.uniqueRecords);`;

const configurationExample = `const result = findDuplicates(records, {
  fields: [
    { key: "name", weight: 0.6 },
    { key: "email", weight: 0.4 }
  ],
  method: "jaro-winkler",
  threshold: 0.85,
  normalization: {
    lowercase: true,
    trim: true,
    normalizeWhitespace: true,
    removeAccents: true
  }
});`;

const exportExample = `import { exportUniqueCSV } from "@matchforge/core";

const csv = exportUniqueCSV(
  {
    ...result,
    records,
    headers: ["name", "email"],
    parseErrors: []
  },
  {
    keep: "most-complete"
  }
);`;

const steps = [
  {
    icon: Database,
    title: "Select fields",
    description: "Choose the fields used to identify duplicate records.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare records",
    description: "Calculate similarity scores using your chosen algorithm.",
  },
  {
    icon: Layers3,
    title: "Group duplicates",
    description: "Organize connected records into duplicate groups.",
  },
  {
    icon: CheckCircle2,
    title: "Get clean results",
    description: "Separate duplicate groups from unique records.",
  },
];

const configurationOptions = [
  ["fields", "Fields to compare, with optional weights."],
  ["method", "Similarity algorithm used for comparisons."],
  ["threshold", "Minimum similarity required to identify a match."],
  ["normalization", "Preprocessing applied before comparison."],
  ["algorithmOptions", "Additional options for supported algorithms."],
];

const resultProperties = [
  ["duplicateGroups", "Groups containing detected duplicate records."],
  ["uniqueRecords", "Records that do not belong to a duplicate group."],
  ["totalRecords", "Total number of input records."],
  ["duplicateGroupsCount", "Number of detected duplicate groups."],
  ["duplicateRecordsCount", "Records contained in duplicate groups."],
  ["uniqueRecordsCount", "Number of unique records."],
];

const exportOptions = [
  {
    value: "most-complete",
    title: "Keep most complete",
    description:
      "Retains the record with the most non-empty fields from each duplicate group.",
    recommended: true,
  },
  {
    value: "first",
    title: "Keep first record",
    description: "Retains the first record from each duplicate group.",
  },
  {
    value: "exclude",
    title: "Exclude duplicate groups",
    description:
      "Removes all records belonging to duplicate groups from the exported dataset.",
  },
];

export default function DatasetDeduplicationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Hero */}
          <section>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Data quality toolkit
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Dataset deduplication
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Find duplicate and near-duplicate records within a single dataset.
              MatchForge compares selected fields, groups similar records, and
              helps you create a cleaner dataset using{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
                findDuplicates()
              </code>
              .
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dataset-deduplication/playground"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                Open playground
                <ArrowUpRight className="size-4" />
              </Link>

              <a
                href="#basic-usage"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-all duration-300 hover:border-primary/40 hover:bg-accent"
              >
                Explore documentation
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
              </a>
            </div>
          </section>

          {/* Animated overview */}
          <section id="how-it-works" className="mt-12 scroll-mt-24">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight">
                From messy data to clean records
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A quick look at how MatchForge detects and organizes duplicates.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                {/* Input */}
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Database className="size-4" />
                    INPUT DATA
                  </div>

                  <div className="space-y-2">
                    {[
                      ["Rahul Sharma", "rahul@gmail.com"],
                      ["Rahul S.", "rahul@gmail.com"],
                      ["Amit Shah", "amit@gmail.com"],
                    ].map(([name, email], index) => (
                      <div
                        key={name}
                        className="rounded-lg border border-border bg-background p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <p className="truncate text-xs font-medium">{name}</p>
                        <p className="mt-1 truncate text-[10px] text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:flex justify-center">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>

                {/* Matching */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-3 py-6 text-center transition-all duration-300 hover:border-primary/50">
                  <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GitCompareArrows className="size-5" />
                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <p className="mt-3 text-xs font-semibold">Matching engine</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Similarity analysis
                  </p>
                </div>

                <div className="hidden sm:flex justify-center">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>

                {/* Output */}
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <CheckCircle2 className="size-4" />
                    OUTPUT
                  </div>

                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 transition-all duration-300 hover:border-primary/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        Duplicate group
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        2 records
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="rounded-md bg-background p-2 text-xs">
                        Rahul Sharma
                      </p>
                      <p className="rounded-md bg-background p-2 text-xs">
                        Rahul S.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span className="text-xs font-medium">1 unique record</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  Example: 3 input records
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary" />1
                    duplicate group
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />1
                    unique record
                  </span>
                </div>
              </div>
            </div>

            {/* How it works */}
            <section id="how-it-works" className="mt-12 scroll-mt-24">
              <div className="mb-7">
                <h2 className="text-xl font-semibold tracking-tight">
                  How dataset deduplication works
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  From selecting comparison fields to identifying duplicates and
                  producing a clean dataset, here is how the process works.
                </p>
              </div>

              <div className="relative">
                {/* Continuous timeline */}
                <div className="absolute bottom-10 left-5 top-10 w-px bg-border" />

                <div className="divide-y divide-border">
                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const labels = [
                      "INPUT",
                      "COMPARISON",
                      "GROUPING",
                      "OUTPUT",
                    ];

                    return (
                      <div
                        key={step.title}
                        className="group relative flex gap-5 py-5 first:pt-2 last:pb-2"
                      >
                        {/* Numbered timeline marker */}
                        <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-semibold text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Step content */}
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                            <Icon className="size-[18px]" />
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <h3 className="text-sm font-semibold tracking-tight">
                                {step.title}
                              </h3>

                              <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                                {labels[index]}
                              </span>
                            </div>

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
          </section>

          {/* Basic usage */}
          <section id="basic-usage" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Pass an array of JavaScript objects to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                findDuplicates()
              </code>
              . Each object represents one record.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
          </section>

          {/* Configuration */}
          <section id="configuration" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Configuration
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Control which fields are compared and how similarity is
              calculated.
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
                  {configurationOptions.map(([name, description]) => (
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

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Field weights let you assign different importance to fields.
              Normalization preprocesses values before comparison. See the{" "}
              <Link
                href="/preprocessing"
                className="font-medium text-primary underline underline-offset-4"
              >
                preprocessing guide
              </Link>{" "}
              for more details.
            </p>
          </section>

          {/* Results */}
          <section id="results" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Understanding results
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The result contains duplicate groups, unique records, and summary
              statistics.
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

            <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <p className="text-sm font-semibold">Duplicate groups</p>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Each group contains its records and the duplicate pairs
                connecting them. Pair information includes record indexes,
                overall similarity scores, and individual field scores. Records
                can be connected through transitive matches, even when every
                pair is not directly matched.
              </p>
            </div>
          </section>

          {/* Export */}
          <section id="export" className="mt-14 scroll-mt-24">
            <div className="flex items-center gap-2">
              <FileDown className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">
                Export cleaned dataset
              </h2>
            </div>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                exportUniqueCSV()
              </code>{" "}
              to export a cleaned CSV. Choose which records to retain from each
              duplicate group.
            </p>

            <div className="mt-5 grid gap-3">
              {exportOptions.map((option, index) => (
                <div
                  key={option.value}
                  className="group flex gap-3 rounded-xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/20"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-transform duration-300 group-hover:scale-110">
                    {index === 0 ? (
                      <Sparkles className="size-4" />
                    ) : index === 1 ? (
                      <Check className="size-4" />
                    ) : (
                      <Database className="size-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{option.title}</h3>
                      {option.recommended && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </p>
                    <code className="mt-2 inline-block rounded bg-muted px-2 py-1 text-[11px]">
                      keep: "{option.value}"
                    </code>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <CodeBlock code={exportExample} language="typescript" />
            </div>

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Unique records are retained in the exported dataset. The selected
              option determines how records belonging to duplicate groups are
              handled.
            </p>
          </section>

          {/* Note */}
          <section className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-semibold">
                  Review before exporting
                </h3>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Duplicate detection identifies potential duplicates based on
                  similarity. Review the detected groups before choosing which
                  records to retain.
                </p>
              </div>
            </div>
          </section>

          {/* Next */}
          <div className="mt-12">
            <p className="text-xs font-semibold text-muted-foreground">NEXT</p>
            <Link
              href="/api-reference"
              className="group mt-3 flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-300 hover:border-primary/40 hover:bg-muted/30"
            >
              <div>
                <p className="text-sm font-semibold">API reference</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore functions, options, and types.
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
                ["Understanding results", "#results"],
                ["Export cleaned dataset", "#export"],
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
