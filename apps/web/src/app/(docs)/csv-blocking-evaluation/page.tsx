import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Layers3,
  Target,
  Gauge,
} from "lucide-react";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";

const example = `import { evaluateBlockingCSV } from "@matchforge/core";

const sourceCSV = \`name
Rahul Sharma
Amit Patel\`;

const targetCSV = \`fullName
Rahul Sharma
Rahul Verma\`;

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
console.log(result.totalPossiblePairs);
console.log(result.totalCandidatePairs);
console.log(result.sourceHeaders);
console.log(result.targetHeaders);
console.log(result.parseErrors);`;

function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary">{number}</span>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Target;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <Icon className="mb-3 size-5 text-primary" />

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function BlockingCSVEvaluationPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-7">
      {/* Header */}
      <header>
        <div className="mb-4 flex items-center gap-2 text-xs text-primary">
          <FileSpreadsheet className="size-4" />

          <span className="font-medium tracking-wide">
            MATCHFORGE DOCUMENTATION
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Blocking CSV Evaluation
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Evaluate blocking strategies directly from CSV datasets using
          MatchForge. The CSV evaluation wrapper parses your source and target
          datasets, generates candidate pairs using configured blocking rules,
          and evaluates the results against labelled ground truth.
        </p>
      </header>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          icon={Layers3}
          title="Candidate generation"
          description="Generate candidate pairs from two CSV datasets using configurable blocking rules."
        />

        <InfoCard
          icon={Target}
          title="Ground-truth evaluation"
          description="Compare generated candidates against labelled source-target record pairs."
        />

        <InfoCard
          icon={Gauge}
          title="Performance metrics"
          description="Measure candidate recall, candidate precision, and reduction ratio."
        />
      </section>

      <div className="border-t border-border" />

      {/* How it works */}
      <Section
        id="workflow"
        number="01"
        title="How it works"
        description="evaluateBlockingCSV() provides a convenient way to evaluate blocking without manually parsing CSV files or generating candidate pairs."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Provide CSV datasets",
              description:
                "Pass the source and target CSV strings to the function.",
            },
            {
              number: "02",
              title: "Configure blocking",
              description:
                "Define blocking rules and provide labelled ground-truth pairs.",
            },
            {
              number: "03",
              title: "Evaluate candidates",
              description:
                "Inspect evaluation metrics and candidate-generation statistics.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-lg border border-border p-4"
            >
              <span className="font-mono text-xs text-primary">
                {item.number}
              </span>

              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3 rounded-lg bg-muted/40 p-4">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted-foreground">
            The CSV wrapper reuses MatchForge's existing candidate-generation
            and blocking-evaluation logic. It does not introduce a separate
            blocking algorithm or evaluation metric.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* API */}
      <Section
        id="usage"
        number="02"
        title="Basic usage"
        description="Import evaluateBlockingCSV() from @matchforge/core and provide both CSV strings along with the blocking configuration and ground truth."
      >
        <CodeBlock language="typescript" code={example} />

        <div className="mt-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Function arguments</h3>

          <div className="mt-3 space-y-3">
            <div>
              <code className="text-xs text-primary">sourceCSV</code>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                CSV string containing the source records.
              </p>
            </div>

            <div>
              <code className="text-xs text-primary">targetCSV</code>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                CSV string containing the target records.
              </p>
            </div>

            <div>
              <code className="text-xs text-primary">options</code>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Blocking configuration, ground-truth pairs, and optional CSV
                parsing configurations.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Blocking rules */}
      <Section
        id="rules"
        number="03"
        title="Blocking rules"
        description="Blocking rules determine which source-target record pairs become candidates. Each rule specifies the fields to compare and the blocking method to apply."
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(100px,0.7fr)_minmax(0,1.5fr)] border-b border-border bg-muted/40 px-4 py-3 text-xs font-medium">
            <span>Method</span>
            <span>Description</span>
          </div>

          {[
            {
              method: "exact",
              description:
                "Generates candidates when the selected field values match exactly after normalization.",
            },
            {
              method: "prefix",
              description:
                "Generates candidates using matching prefixes of the configured length.",
            },
            {
              method: "soundex",
              description:
                "Generates candidates using phonetic Soundex encodings.",
            },
          ].map((item) => (
            <div
              key={item.method}
              className="grid grid-cols-[minmax(100px,0.7fr)_minmax(0,1.5fr)] gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <code className="text-xs text-primary">{item.method}</code>

              <p className="text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Rule configuration</h3>

          <CodeBlock
            language="typescript"
            code={`{
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
  ],
}`}
          />

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            sourceKey and targetKey identify the corresponding fields in the
            source and target records. The length property configures the prefix
            length for prefix-based rules.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Metrics */}
      <Section
        id="metrics"
        number="04"
        title="Evaluation metrics"
        description="Blocking evaluation measures how effectively a blocking strategy reduces comparisons while retaining genuine matching pairs."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoCard
            icon={Target}
            title="Candidate Recall"
            description="The proportion of all labelled true pairs retained by blocking."
          />

          <InfoCard
            icon={CheckCircle2}
            title="Candidate Precision"
            description="The proportion of labelled candidate pairs that are genuine matches."
          />

          <InfoCard
            icon={Gauge}
            title="Reduction Ratio"
            description="The proportion of all possible comparisons eliminated by blocking."
          />
        </div>

        <div className="mt-5 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Metric calculations</h3>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium">Candidate Recall</p>

              <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
                trueCandidatePairs / totalTruePairs
              </div>
            </div>

            <div>
              <p className="text-xs font-medium">Candidate Precision</p>

              <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
                trueCandidatePairs / totalLabelledCandidatePairs
              </div>
            </div>

            <div>
              <p className="text-xs font-medium">Reduction Ratio</p>

              <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
                1 - (totalCandidatePairs / totalPossiblePairs)
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            All metrics are returned as decimal values between 0 and 1. When a
            denominator is zero, the corresponding metric is 0.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Result */}
      <Section
        id="result"
        number="05"
        title="Understanding the result"
        description="The function returns the blocking evaluation result together with CSV metadata from both parsed datasets."
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(130px,0.9fr)_minmax(0,1.5fr)] border-b border-border bg-muted/40 px-4 py-3 text-xs font-medium">
            <span>Property</span>
            <span>Description</span>
          </div>

          {[
            {
              property: "metrics",
              description:
                "Candidate recall, candidate precision, and reduction ratio.",
            },
            {
              property: "totalPossiblePairs",
              description: "Total possible source-target record combinations.",
            },
            {
              property: "totalCandidatePairs",
              description: "Number of candidate pairs generated by blocking.",
            },
            {
              property: "totalEvaluatedPairs",
              description: "Number of ground-truth pairs supplied.",
            },
            {
              property: "totalLabelledCandidatePairs",
              description:
                "Number of labelled pairs that were generated as candidates.",
            },
            {
              property: "trueCandidatePairs",
              description:
                "Number of labelled true matches retained as candidates.",
            },
            {
              property: "totalTruePairs",
              description: "Total number of labelled true matches.",
            },
            {
              property: "sourceHeaders",
              description: "Column headers parsed from the source CSV.",
            },
            {
              property: "targetHeaders",
              description: "Column headers parsed from the target CSV.",
            },
            {
              property: "parseErrors",
              description:
                "Parsing errors reported separately for source and target CSV inputs.",
            },
          ].map((item) => (
            <div
              key={item.property}
              className="grid grid-cols-[minmax(130px,0.9fr)_minmax(0,1.5fr)] gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <code className="break-all text-xs text-primary">
                {item.property}
              </code>

              <p className="text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* CSV options */}
      <Section
        id="parsing"
        number="06"
        title="CSV parsing options"
        description="The source and target CSV inputs can use separate parsing configurations."
      >
        <CodeBlock
          language="typescript"
          code={`const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
  rules: [
    {
      sourceKey: "name",
      targetKey: "fullName",
      method: "prefix",
      length: 3,
    },
  ],
  groundTruth,

  sourceParseOptions: {
    // Source CSV parsing configuration
  },

  targetParseOptions: {
    // Target CSV parsing configuration
  },
});`}
        />

        <div className="mt-4 flex gap-3 rounded-lg border border-border p-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-5 text-muted-foreground">
            Parsing errors are returned through parseErrors.source and
            parseErrors.target. Inspect them before relying on the evaluation
            metrics.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Ground truth */}
      <Section
        id="ground-truth"
        number="07"
        title="Ground-truth indexing"
        description="Ground-truth indexes refer to parsed data records, not physical line numbers in the CSV files."
      >
        <div className="space-y-3">
          {[
            "The header row is not included in record indexing.",
            "Record indexes start at 0.",
            "Empty lines skipped by the parser are not counted as records.",
            "sourceIndex identifies a source record, while targetIndex identifies a target record.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

              <p className="text-xs leading-5 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Example</h3>

          <CodeBlock
            language="csv"
            code={`name
Rahul Sharma
Amit Patel`}
          />

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Rahul Sharma has index 0, and Amit Patel has index 1. The header row
            is excluded.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Important considerations */}
      <Section
        id="considerations"
        number="08"
        title="Important considerations"
        description="Keep these points in mind when interpreting blocking evaluation results."
      >
        <div className="space-y-3">
          {[
            {
              title: "Unlabelled pairs are not negative pairs",
              description:
                "Only explicitly labelled pairs are used for evaluation. Unlabelled candidate pairs are not automatically treated as false positives.",
            },
            {
              title: "Candidate precision depends on label coverage",
              description:
                "With sparse ground truth, candidate precision may not represent the precision across every generated candidate pair.",
            },
            {
              title: "Blocking affects matching recall",
              description:
                "A genuine pair removed during candidate generation cannot be recovered by the matching stage that follows.",
            },
            {
              title: "Compare different blocking configurations",
              description:
                "Use the metrics to understand the trade-off between retaining genuine pairs and reducing unnecessary comparisons.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border p-4"
            >
              <h3 className="text-sm font-medium">{item.title}</h3>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Playground CTA */}
      <section className="rounded-xl border border-border bg-muted/20 p-6 sm:p-8">
        <p className="text-xs font-medium tracking-wide text-primary">
          EXPLORE THE PLAYGROUND
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          Experience Blocking Evaluation
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Try different blocking rules, work with sample datasets, and
          understand how candidate generation affects evaluation metrics in the
          interactive Blocking Evaluation playground.
        </p>

        <div className="mt-5">
          <Link
            href="/blocking-evaluation/playground"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Try Blocking Evaluation
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
