import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Database,
  FileSpreadsheet,
  GitCompareArrows,
  Layers3,
  ScanText,
  Workflow,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

import { ProcessVisualization } from "@/components/ProcessOverview";

const features = [
  {
    icon: ScanText,
    title: "Text preprocessing",
    description:
      "Normalize casing, whitespace, punctuation, and accents before comparing strings.",
    href: "/preprocessing",
  },
  {
    icon: GitCompareArrows,
    title: "String similarity",
    description:
      "Compare strings using edit-distance, character-based, q-gram, and phonetic algorithms.",
    href: "/compare",
  },
  {
    icon: Database,
    title: "Record matching",
    description:
      "Match records across datasets with configurable fields, weights, and thresholds.",
    href: "/record-matching",
  },
  {
    icon: Layers3,
    title: "Dataset deduplication",
    description:
      "Identify duplicate records, group related entries, and retrieve unique records.",
    href: "/dataset-deduplication",
  },
  {
    icon: Workflow,
    title: "Candidate blocking",
    description:
      "Generate candidate pairs using configurable blocking rules before matching.",
    href: "/blocking",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Evaluation",
    description:
      "Evaluate matching predictions and blocking results against labelled ground truth.",
    href: "/matching-evaluation",
  },
];

const workflows = [
  {
    title: "CSV record matching",
    description: "Match records directly from two CSV datasets.",
    href: "/csv-record-matching",
    icon: FileSpreadsheet,
  },
  {
    title: "CSV dataset deduplication",
    description: "Find duplicates and export cleaned CSV data.",
    href: "/csv-dataset-deduplication",
    icon: Database,
  },
  {
    title: "CSV evaluation",
    description: "Evaluate matching and blocking workflows using CSV inputs.",
    href: "/csv-evaluation",
    icon: ChartNoAxesCombined,
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,var(--color-accent),transparent_48%)] opacity-60" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Open-source TypeScript toolkit
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Make sense of
              <span className="text-primary"> imperfect data.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              MatchForge brings string similarity, text preprocessing, record
              matching, blocking, and dataset deduplication together in one
              framework-independent toolkit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/installation"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/record-matching/playground"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Try the playground
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                JavaScript & TypeScript
              </span>
              <span className="inline-flex items-center gap-2">
                <Braces className="size-4 text-primary" />
                Framework independent
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Open source
              </span>
            </div>
          </div>

          {/* Workflow illustration */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative rounded-2xl border border-border/70 bg-background/70 p-3 shadow-2xl shadow-primary/5 backdrop-blur">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Entity resolution workflow
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  MATCHFORGE / CORE
                </span>
              </div>

              <div className="rounded-xl bg-muted/30 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0 rounded-lg border border-border bg-card p-3">
                    <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Source
                    </p>
                    <p className="truncate font-mono text-xs font-medium">
                      Jane Smith
                    </p>
                    <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                      jane@example.com
                    </p>
                  </div>

                  <div className="min-w-0 rounded-lg border border-border bg-card p-3">
                    <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Target
                    </p>
                    <p className="truncate font-mono text-xs font-medium">
                      JANE SMYTH
                    </p>
                    <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                      jane@example.com
                    </p>
                  </div>
                </div>

                <div className="flex justify-center py-3">
                  <div className="h-5 w-px bg-primary/50" />
                </div>

                <div className="rounded-lg border border-primary/20 bg-accent/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primary">
                      MATCHFORGE TOOLKIT
                    </span>
                    <GitCompareArrows className="size-4 text-primary" />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["Normalize", "Compare", "Match"].map((item) => (
                      <div
                        key={item}
                        className="rounded-md border border-primary/10 bg-background/70 px-2 py-2 text-center text-[10px] font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center py-3">
                  <div className="h-5 w-px bg-primary/50" />
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GitCompareArrows className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">
                      Potential matching records
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Similarity-based entity resolution
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] font-medium text-primary">
                    Identified
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              Conceptual illustration of the MatchForge workflow
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <div id="how-it-works" className="scroll-mt-20">
        <ProcessVisualization />
      </div>

      {/* Features */}
      <section className="border-y border-border/70 bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Core capabilities
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to work with imperfect data.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Build entity resolution workflows using modular capabilities
              designed to work together.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 flex items-center justify-between gap-2 text-sm font-semibold">
                    {feature.title}
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CSV workflows */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Work with real datasets
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                CSV workflows, built in.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Work directly with CSV data for matching, deduplication, and
                evaluation.
              </p>
            </div>

            <Link
              href="/csv-record-matching"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore CSV documentation
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;

              return (
                <Link
                  key={workflow.title}
                  href={workflow.href}
                  className="group flex gap-4 rounded-xl border border-border p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      {workflow.title}
                      <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Developer CTA */}
      <section className="border-t border-border/70 bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Built for developers
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with one package.
              <br />
              Build your own workflow.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Use MatchForge Core in your JavaScript or TypeScript application.
              Its matching logic is independent of any frontend framework.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/installation"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Read the documentation
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="https://www.npmjs.com/package/@matchforge/core"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                npm package
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-medium">Terminal</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                npm
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="font-mono text-sm">
                <span className="mr-2 text-primary">$</span>
                npm install @matchforge/core
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Import what you need
                </p>

                <pre className="overflow-x-auto font-mono text-xs leading-6 text-foreground">
                  {`import {
  normalizeString,
  compareStrings,
  matchRecords,
  generateCandidates,
} from "@matchforge/core";`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
