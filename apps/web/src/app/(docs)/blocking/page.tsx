import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Info,
  Layers3,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const basicExample = `import { generateCandidates } from "@matchforge/core";

const source = [
  { name: "Pavan Kapadiya", city: "Delhi" },
  { name: "Rahul Patel", city: "Ahmedabad" },
  { name: "Amit Shah", city: "Mumbai" },
];

const target = [
  { fullName: "Pavan Kapadia", location: "Delhi" },
  { fullName: "Rahul Patel", location: "Ahmedabad" },
  { fullName: "Neha Shah", location: "Mumbai" },
];

const result = generateCandidates(source, target, {
  rules: [
    {
      sourceKey: "city",
      targetKey: "location",
      method: "exact",
    },
  ],
});

console.log(result.pairs);
console.log(result.stats);`;

const multipleRulesExample = `const result = generateCandidates(source, target, {
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
  normalization: {
    lowercase: true,
    trim: true,
    normalizeWhitespace: true,
    removeAccents: true,
  },
});`;

const matchingExample = `import { matchRecords } from "@matchforge/core";

const result = matchRecords(source, target, {
  fields: [
    { sourceKey: "name", targetKey: "fullName" },
    { sourceKey: "city", targetKey: "location" },
  ],
  method: "jaro-winkler",
  threshold: 0.8,
  blocking: {
    rules: [
      {
        sourceKey: "city",
        targetKey: "location",
        method: "exact",
      },
    ],
  },
});`;

const deduplicationExample = `import { findDuplicates } from "@matchforge/core";

const result = findDuplicates(records, {
  fields: [
    { key: "name", weight: 0.7 },
    { key: "city", weight: 0.3 },
  ],
  method: "jaro-winkler",
  threshold: 0.8,
  blocking: {
    rules: [
      { key: "city", method: "exact" },
      { key: "name", method: "prefix", length: 3 },
    ],
  },
});`;

const methods = [
  {
    name: "Exact",
    value: "exact",
    description:
      "Records are grouped when their normalized field values are identical.",
    example: '"Delhi" and "delhi" with lowercase normalization',
  },
  {
    name: "Prefix",
    value: "prefix",
    description:
      "Records are grouped when the first configured number of characters match.",
    example: '"Pavan" and "Pavani" with length: 3',
  },
  {
    name: "Soundex",
    value: "soundex",
    description: "Records are grouped when their Soundex phonetic codes match.",
    example: '"Smith" and "Smyth"',
  },
];

const stats = [
  ["totalSourceRecords", "Number of records in the source dataset."],
  ["totalTargetRecords", "Number of records in the target dataset."],
  [
    "totalPossiblePairs",
    "Total possible comparisons: source count × target count.",
  ],
  ["candidatePairs", "Number of unique candidate pairs generated."],
  [
    "reductionPercentage",
    "Percentage of possible comparisons eliminated by blocking.",
  ],
];

const sections = [
  ["why-blocking", "Why blocking?"],
  ["how-it-works", "How it works"],
  ["methods", "Blocking methods"],
  ["basic-usage", "Basic usage"],
  ["multiple-rules", "Multiple rules"],
  ["configuration", "Configuration"],
  ["statistics", "Statistics"],
  ["record-matching", "Record matching"],
  ["deduplication", "Deduplication"],
  ["considerations", "Considerations"],
];

export default function BlockingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-primary">
            <Blocks className="size-4" />
            Blocking for Record-matching & Deduplication
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Blocking &amp; Candidate Generation
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Blocking reduces the number of record comparisons by grouping
            records using selected fields. Instead of comparing every source
            record against every target record, MatchForge generates a smaller
            set of candidate pairs for further matching.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/blocking/playground"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Try the playground
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/record-matching"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-accent"
            >
              Record matching
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="my-10 border-t border-border" />

          <section id="why-blocking" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Why blocking?</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Suppose the source dataset contains N records and the target
              dataset contains M records. Without blocking, exhaustive
              comparison requires N × M record comparisons. This becomes
              expensive as datasets grow.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers3 className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Without blocking
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold">N × M</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Every source record may be compared with every target record.
                </p>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    With blocking
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold">Fewer pairs</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Only pairs sharing at least one blocking key are retained.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Blocking is not the final matching decision. It generates
              candidate pairs that can subsequently be evaluated using
              similarity algorithms and matching thresholds.
            </p>
          </section>

          <section id="how-it-works" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">
              How candidate generation works
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge generates a blocking key for each record using the
              selected field and method. Records with matching keys are included
              as candidate pairs.
            </p>

            <div className="mt-5 rounded-xl border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                    SOURCE DATASET
                  </p>
                  <p className="mt-3 text-sm font-medium">Pavan Kapadiya</p>
                  <p className="text-xs text-muted-foreground">Delhi</p>
                  <p className="mt-3 text-sm font-medium">Rahul Patel</p>
                  <p className="text-xs text-muted-foreground">Ahmedabad</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                    TARGET DATASET
                  </p>
                  <p className="mt-3 text-sm font-medium">Pavan Kapadia</p>
                  <p className="text-xs text-muted-foreground">Delhi</p>
                  <p className="mt-3 text-sm font-medium">Rahul Patel</p>
                  <p className="text-xs text-muted-foreground">Ahmedabad</p>
                </div>
              </div>

              <div className="my-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-3 py-2">
                  Blocking key: city
                </span>
                <ArrowRight className="size-4" />
                <span className="rounded-md bg-primary/10 px-3 py-2 text-primary">
                  Candidate pairs
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3 text-xs">
                  <span className="font-mono text-primary">(0, 0)</span>
                  <span className="ml-2 text-muted-foreground">
                    Delhi ↔ Delhi
                  </span>
                </div>
                <div className="rounded-lg border border-border p-3 text-xs">
                  <span className="font-mono text-primary">(1, 1)</span>
                  <span className="ml-2 text-muted-foreground">
                    Ahmedabad ↔ Ahmedabad
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section id="methods" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">
              Supported blocking methods
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Each rule selects a source field and a target field, then applies
              one of the following blocking methods.
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              {methods.map((method, index) => (
                <div
                  key={method.value}
                  className="grid grid-cols-[90px_minmax(0,1fr)] gap-3 border-b border-border p-4 last:border-0"
                >
                  <code className="text-xs font-semibold text-primary">
                    {method.value}
                  </code>
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {method.description}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Example: {method.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="basic-usage" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">Basic usage</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Import <code>generateCandidates()</code> and provide source
              records, target records, and at least one blocking rule.
            </p>
            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Every returned pair contains the original source and target array
              indexes. Use these indexes to retrieve the corresponding records
              from the input datasets.
            </p>
          </section>

          <section id="multiple-rules" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">Multiple blocking rules</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You can configure multiple rules. MatchForge combines their
              candidate pairs using OR semantics: a pair is included if it
              matches at least one rule. Pairs generated by multiple rules are
              deduplicated.
            </p>
            <div className="mt-5">
              <CodeBlock code={multipleRulesExample} language="typescript" />
            </div>
            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                Prefix blocking defaults to a length of 3 when length is not
                provided. The configured length must be a positive integer.
                Normalization is applied before generating blocking keys.
              </p>
            </div>
          </section>

          <section id="configuration" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">Configuration</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              {[
                ["rules", "BlockingRule[]", "Required. At least one rule."],
                [
                  "sourceKey",
                  "string",
                  "Source record field used for the blocking key.",
                ],
                [
                  "targetKey",
                  "string",
                  "Target record field used for the blocking key.",
                ],
                [
                  "method",
                  '"exact" | "prefix" | "soundex"',
                  "Blocking method.",
                ],
                ["length", "number", "Optional prefix length. Defaults to 3."],
                [
                  "normalization",
                  "NormalizeOptions",
                  "Optional normalization applied before key generation.",
                ],
              ].map(([name, type, description]) => (
                <div
                  key={name}
                  className="grid gap-1 border-b border-border px-4 py-3 last:border-0 sm:grid-cols-[125px_190px_minmax(0,1fr)] sm:gap-3"
                >
                  <code className="text-xs font-semibold text-primary">
                    {name}
                  </code>
                  <code className="text-[11px] text-muted-foreground">
                    {type}
                  </code>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Available normalization options include lowercase, trim,
              removePunctuation, removeAccents, and normalizeWhitespace.
            </p>
          </section>

          <section id="statistics" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">
              Candidate generation statistics
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The result contains the generated pairs and statistics describing
              the reduction in the comparison search space.
            </p>
            <div className="mt-5">
              <CodeBlock
                code={`console.log(result.stats);

// {
//   totalSourceRecords: 3,
//   totalTargetRecords: 3,
//   totalPossiblePairs: 9,
//   candidatePairs: 3,
//   reductionPercentage: 66.6666666667
// }`}
                language="typescript"
              />
            </div>
            <div className="mt-5 space-y-3">
              {stats.map(([name, description]) => (
                <div key={name} className="flex gap-3">
                  <div className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <p className="text-xs leading-6 text-muted-foreground">
                    <code className="font-semibold text-foreground">
                      {name}
                    </code>
                    {" — "}
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="record-matching" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">
              Use blocking with record matching
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Pass blocking configuration directly to{" "}
              <code>matchRecords()</code>. MatchForge generates candidate pairs
              first and performs matching only for those pairs.
            </p>
            <div className="mt-5">
              <CodeBlock code={matchingExample} language="typescript" />
            </div>
          </section>

          <section id="deduplication" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">
              Use blocking with dataset deduplication
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              For deduplication, use the <code>blocking</code> option in{" "}
              <code>findDuplicates()</code>. Each duplicate blocking rule
              selects a single field from the dataset.
            </p>
            <div className="mt-5">
              <CodeBlock code={deduplicationExample} language="typescript" />
            </div>
          </section>

          <section id="considerations" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold">Important considerations</h2>
            <div className="mt-5 space-y-3">
              {[
                "Blocking generates candidate pairs; it does not determine whether two records are a match.",
                "Multiple rules use OR semantics. A pair matching any rule is included.",
                "Duplicate candidate pairs are returned only once.",
                "Missing, null, empty, and normalized-empty blocking values are skipped.",
                "Present blocking field values must be strings. A non-string value causes an error.",
                "A restrictive blocking strategy may exclude genuine matches. Evaluate candidate recall before relying on it.",
                "Candidate indexes refer to the original source and target arrays.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg bg-muted/40 p-3"
                >
                  <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="text-xs leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">
              Explore blocking interactively
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Configure blocking methods, inspect candidate pairs, and see how
              blocking changes the number of comparisons.
            </p>
            <Link
              href="/blocking/playground"
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Open blocking playground
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-muted-foreground">
              ON THIS PAGE
            </p>
            <nav className="space-y-2 text-xs text-muted-foreground">
              {sections.map(([id, label]) => (
                <a
                  key={id}
                  href={`#\${id}`}
                  className="block transition-colors hover:text-foreground"
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
