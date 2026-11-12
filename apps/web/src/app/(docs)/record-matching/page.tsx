import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Database,
  GitCompareArrows,
  Info,
  Layers3,
  Scale,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";

const basicExample = `import { matchRecords } from "@matchforge/core";

const source = [
  { name: "Pavan Kapadiya", city: "New Delhi" },
  { name: "Rahul Patel", city: "Ahmedabad" }
];

const target = [
  { fullName: "Pawan Kapadia", location: "Delhi" },
  { fullName: "Rahul Patel", location: "Ahmedabad" }
];

const result = matchRecords(source, target, {
  fields: [
    { sourceKey: "name", targetKey: "fullName" },
    { sourceKey: "city", targetKey: "location" }
  ]
});

console.log(result);`;

const configurationExample = `const result = matchRecords(source, target, {
  fields: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      weight: 0.7
    },
    {
      sourceKey: "city",
      targetKey: "location",
      weight: 0.3
    }
  ],
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 3,
  normalization: {
    lowercase: true,
    trim: true,
    normalizeWhitespace: true,
    removeAccents: true
  }
});`;

const options = [
  {
    name: "fields",
    description:
      "Maps source fields to their corresponding target fields. Each field can have an optional weight.",
  },
  {
    name: "method",
    description:
      "Selects the similarity algorithm used for comparing field values.",
  },
  {
    name: "threshold",
    description:
      "Sets the minimum similarity score required for a candidate to qualify as a match.",
  },
  {
    name: "topK",
    description: "Controls the number of top candidates returned.",
  },
  {
    name: "normalization",
    description:
      "Preprocesses mapped field values before similarity comparison.",
  },
];

export default function RecordMatchingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Record matching
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Record matching identifies corresponding records across two
            datasets, even when their values are not exactly identical.
            MatchForge provides field mapping, weighted matching, and
            configurable similarity options through{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
              matchRecords()
            </code>
            .
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/record-matching/playground"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try in playground
              <ArrowUpRight className="size-4" />
            </Link>
            <Button
              variant="ghost"
              className="group h-10 rounded-lg border border-border p-0 transition-all duration-300 hover:border-primary/40 hover:bg-accent/50"
            >
              <a
                href="#basic-usage"
                className="inline-flex h-full w-full items-center justify-center gap-2 px-4 text-sm font-medium"
              >
                Scroll to Discover
                <ArrowDown className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-y-1 group-hover:text-primary" />
              </a>
            </Button>{" "}
          </div>
          <div className="my-10 border-t border-border" />

          <section id="how-it-works" className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              How record matching works
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge compares mapped fields between source and target
              records, calculates an overall similarity score, and evaluates
              potential matches against a threshold.
            </p>

            <div className="mt-5 rounded-xl border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground">
                    SOURCE RECORD
                  </p>
                  <p className="mt-3 text-sm font-semibold">Pavan Kapadiya</p>
                  <p className="text-xs text-muted-foreground">name</p>

                  <div className="my-3 border-t border-border" />

                  <p className="text-sm font-semibold">New Delhi</p>
                  <p className="text-xs text-muted-foreground">city</p>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground">
                    TARGET RECORD
                  </p>
                  <p className="mt-3 text-sm font-semibold">Pawan Kapadia</p>
                  <p className="text-xs text-muted-foreground">fullName</p>

                  <div className="my-3 border-t border-border" />

                  <p className="text-sm font-semibold">Delhi</p>
                  <p className="text-xs text-muted-foreground">location</p>
                </div>
              </div>

              <div className="my-5 border-t border-border" />

              <div className="space-y-3">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Layers3 className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">01. Field mapping</h3>
                  </div>

                  <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
                    <code className="rounded bg-muted p-2 text-center">
                      name
                    </code>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <code className="rounded bg-muted p-2 text-center">
                      fullName
                    </code>

                    <code className="rounded bg-muted p-2 text-center">
                      city
                    </code>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <code className="rounded bg-muted p-2 text-center">
                      location
                    </code>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <GitCompareArrows className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">
                      02. Field comparison
                    </h3>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3 rounded-md bg-muted/50 p-3">
                      <div>
                        <p className="text-xs font-medium">Name</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pavan Kapadiya ↔ Pawan Kapadia
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        70% weight
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-md bg-muted/50 p-3">
                      <div>
                        <p className="text-xs font-medium">City</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          New Delhi ↔ Delhi
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        30% weight
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-accent/40 p-4">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">
                      03. Match evaluation
                    </h3>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    Field similarity scores contribute to an overall matching
                    score according to their weights.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-background/70 p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Threshold</p>
                      <p className="mt-1 font-mono text-sm">0.80</p>
                    </div>

                    <ArrowRight className="size-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">Decision</p>
                      <p className="mt-1 text-xs font-medium">
                        Qualify if score ≥ threshold
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="basic-usage" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Import{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                matchRecords()
              </code>{" "}
              and provide your source dataset, target dataset, and field
              mappings. Field mappings connect properties that may have
              different names in each dataset.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
          </section>

          <section id="field-mapping" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Field mapping
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                sourceKey
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                targetKey
              </code>{" "}
              to specify which properties should be compared.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-2 border-b border-border bg-muted/50 px-4 py-3 text-xs font-medium">
                <span>Source field</span>
                <span>Target field</span>
              </div>

              {[
                ["name", "fullName"],
                ["city", "location"],
                ["email", "emailAddress"],
              ].map(([source, target]) => (
                <div
                  key={source}
                  className="grid grid-cols-2 border-b border-border px-4 py-3 text-sm last:border-0"
                >
                  <code className="text-xs">{source}</code>
                  <code className="text-xs">{target}</code>
                </div>
              ))}
            </div>
          </section>

          <section id="configuration" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Configure matching
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Configure the similarity method, field weights, matching
              threshold, candidate count, and normalization options.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Option</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {options.map((option) => (
                    <tr key={option.name}>
                      <td className="px-3 py-3 align-top">
                        <code className="text-xs font-medium">
                          {option.name}
                        </code>
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

            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-accent/40 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                Normalization is optional. When provided, the same preprocessing
                options are applied to mapped field values before similarity
                comparison. If omitted, the default normalization behavior is
                used. See the{" "}
                <Link
                  href="/preprocessing"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  preprocessing guide
                </Link>{" "}
                for available options.
              </p>
            </div>
          </section>

          <section id="important" className="mt-12 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Important considerations
              </h2>

              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Best practices
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Keep these points in mind when matching records.
            </p>

            <div className="mt-6 divide-y divide-border border-y border-border">
              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Database className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Map equivalent fields
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Connect corresponding properties between datasets, even when
                    their field names differ.
                  </p>
                </div>

                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  01
                </span>
              </div>

              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Scale className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Choose appropriate weights
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Give more importance to fields that are more useful for
                    identifying the same entity.
                  </p>
                </div>

                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  02
                </span>
              </div>

              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <GitCompareArrows className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">Tune the threshold</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Test different threshold values against your data to control
                    which candidates qualify as matches.
                  </p>
                </div>

                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  03
                </span>
              </div>
            </div>
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
                ["How it works", "#how-it-works"],
                ["Basic usage", "#basic-usage"],
                ["Field mapping", "#field-mapping"],
                ["Configure matching", "#configuration"],
                ["Important considerations", "#important"],
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
              href="/record-matching/playground"
              className="group mt-8 block rounded-xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Try Record Matching
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Compare datasets, map fields, and inspect matching results.
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
