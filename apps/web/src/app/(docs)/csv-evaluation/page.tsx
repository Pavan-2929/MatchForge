import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  GitCompareArrows,
  Layers3,
  Target,
} from "lucide-react";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";

const matchingExample = `import { evaluateMatchesCSV } from "@matchforge/core";

const sourceCSV = \`name,email
Rahul Sharma,rahul@example.com
Priya Patel,priya@example.com\`;

const targetCSV = \`full_name,email_address
Rahul S Sharma,rahul@example.com
Priya P Patel,priya@example.com\`;

const result = evaluateMatchesCSV(sourceCSV, targetCSV, {
  fields: [
    { sourceKey: "name", targetKey: "full_name", weight: 0.6 },
    { sourceKey: "email", targetKey: "email_address", weight: 0.4 },
  ],
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 1,
  groundTruth: [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 1, targetIndex: 1, isMatch: true },
  ],
});

console.log(result.metrics);
console.log(result.confusionMatrix);
console.log(result.sourceHeaders);
console.log(result.targetHeaders);
console.log(result.parseErrors);`;

const blockingExample = `import { evaluateBlockingCSV } from "@matchforge/core";

const sourceCSV = \`name,city
Rahul Sharma,Ahmedabad
Priya Patel,Surat\`;

const targetCSV = \`full_name,location
Rahul S Sharma,Ahmedabad
Priya P Patel,Surat\`;

const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
  rules: [
    {
      sourceKey: "city",
      targetKey: "location",
      method: "exact",
    },
    {
      sourceKey: "name",
      targetKey: "full_name",
      method: "prefix",
      length: 3,
    },
  ],
  groundTruth: [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 1, targetIndex: 1, isMatch: true },
    { sourceIndex: 0, targetIndex: 1, isMatch: false },
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

export default function CSVEvaluationPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-7">
      <header>
        <div className="mb-4 flex items-center gap-2 text-xs text-primary">
          <FileSpreadsheet className="size-4" />
          <span className="font-medium tracking-wide">
            MATCHFORGE DOCUMENTATION
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          CSV Evaluation
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Evaluate record-matching predictions and blocking strategies directly
          from CSV strings. MatchForge parses both datasets, runs the selected
          workflow, compares its output with labelled ground truth, and returns
          evaluation results together with CSV headers and parsing errors.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <InfoCard
          icon={GitCompareArrows}
          title="CSV matching evaluation"
          description="Use evaluateMatchesCSV() to measure matching predictions against labelled record pairs."
        />
        <InfoCard
          icon={Layers3}
          title="CSV blocking evaluation"
          description="Use evaluateBlockingCSV() to measure candidate recall, candidate precision, and reduction ratio."
        />
      </section>

      <div className="border-t border-border" />

      <Section
        id="workflow"
        number="01"
        title="How it works"
        description="Both functions accept source and target CSV strings, parse them, and then invoke the corresponding core matching or blocking and evaluation functions."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Provide CSV strings",
              description: "Pass the source and target CSV contents.",
            },
            {
              number: "02",
              title: "Configure evaluation",
              description:
                "Supply matching or blocking options and ground truth.",
            },
            {
              number: "03",
              title: "Inspect the result",
              description: "Review metrics, parsed headers, and parse errors.",
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
            The CSV functions are convenience wrappers. They reuse MatchForge's
            existing evaluation logic; they do not define separate evaluation
            metrics.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      <Section
        id="matching"
        number="02"
        title="CSV matching evaluation"
        description="evaluateMatchesCSV() runs matchRecords() on the parsed CSV records and evaluates the resulting predictions against the supplied ground-truth pairs."
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <InfoCard
            icon={Target}
            title="What it measures"
            description="Whether the predicted record matches agree with the labelled relationships."
          />
          <InfoCard
            icon={CheckCircle2}
            title="Metrics returned"
            description="Precision, recall, F1-score, accuracy, and the true/false positive/negative counts."
          />
        </div>

        <CodeBlock language="typescript" code={matchingExample} />

        <div className="mt-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Options</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            The third argument combines MatchingOptions with groundTruth and
            optional sourceParseOptions and targetParseOptions. MatchingOptions
            accepts either fields (an array of sourceKey/targetKey mappings with
            optional weights) or a single sourceKey and targetKey pair. It also
            supports method, threshold, topK, normalization, algorithmOptions,
            and blocking.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      <Section
        id="blocking"
        number="03"
        title="CSV blocking evaluation"
        description="evaluateBlockingCSV() parses both datasets, generates candidate pairs using the supplied blocking rules, and evaluates those candidates against ground truth."
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <InfoCard
            icon={Target}
            title="Candidate recall"
            description="The proportion of labelled genuine matches retained as candidates."
          />
          <InfoCard
            icon={CheckCircle2}
            title="Candidate precision"
            description="The proportion of labelled candidate pairs that are genuine matches."
          />
          <InfoCard
            icon={Layers3}
            title="Reduction ratio"
            description="The proportion of all possible comparisons eliminated by blocking."
          />
        </div>

        <CodeBlock language="typescript" code={blockingExample} />

        <div className="mt-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Options</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            The third argument combines BlockingOptions with groundTruth and
            optional sourceParseOptions and targetParseOptions. BlockingOptions
            requires rules. Each rule defines sourceKey, targetKey, and a method
            of exact, prefix, or soundex; prefix rules can also specify length.
            Optional normalization settings are applied during candidate
            generation.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      <Section
        id="results"
        number="04"
        title="Understanding the result"
        description="Both functions return their normal evaluation result, along with parsed CSV metadata."
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(120px,0.8fr)_minmax(0,1.5fr)] border-b border-border bg-muted/40 px-4 py-3 text-xs font-medium">
            <span>Field</span>
            <span>Description</span>
          </div>

          {[
            {
              field: "metrics",
              description:
                "Matching metrics or blocking metrics, depending on the function used.",
            },
            {
              field: "sourceHeaders",
              description: "Column headers parsed from the source CSV.",
            },
            {
              field: "targetHeaders",
              description: "Column headers parsed from the target CSV.",
            },
            {
              field: "parseErrors.source",
              description: "Parsing errors reported for the source CSV.",
            },
            {
              field: "parseErrors.target",
              description: "Parsing errors reported for the target CSV.",
            },
          ].map((item) => (
            <div
              key={item.field}
              className="grid grid-cols-[minmax(120px,0.8fr)_minmax(0,1.5fr)] gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <code className="break-all text-xs text-primary">
                {item.field}
              </code>
              <p className="text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold">Matching result</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Also includes confusionMatrix and totalEvaluatedPairs.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold">Blocking result</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Also includes totalPossiblePairs, totalCandidatePairs,
              totalEvaluatedPairs, totalLabelledCandidatePairs,
              trueCandidatePairs, and totalTruePairs.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3 rounded-lg border border-border p-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-5 text-muted-foreground">
            Inspect parseErrors before interpreting the metrics. The parser
            reports errors separately for the source and target CSV inputs.
          </p>
        </div>
      </Section>

      <div className="border-t border-border" />

      <Section
        id="considerations"
        number="05"
        title="Important considerations"
        description="Evaluation is only as reliable as the input data and ground-truth labels."
      >
        <div className="space-y-3">
          {[
            {
              title: "Ground-truth indexes refer to parsed record positions",
              description:
                "sourceIndex and targetIndex identify records in the parsed source and target datasets, respectively.",
            },
            {
              title: "Only labelled pairs are evaluated",
              description:
                "Unlabelled pairs are not automatically treated as non-matches. Include representative positive and negative labels.",
            },
            {
              title: "Candidate precision depends on label coverage",
              description:
                "For blocking evaluation, candidate precision is calculated from labelled candidate pairs. Sparse labels may not represent the full candidate set.",
            },
            {
              title: "Parsing options can be configured independently",
              description:
                "Use sourceParseOptions and targetParseOptions when the two CSV files require different delimiters or empty-line handling.",
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

      <section className="rounded-xl border border-border bg-muted/20 p-6 sm:p-8">
        <p className="text-xs font-medium tracking-wide text-primary">
          EXPLORE THE PLAYGROUNDS
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          Experience MatchForge evaluation
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Try the interactive evaluation workflows using sample datasets in the
          Matching Evaluation and Blocking Evaluation playgrounds.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/matching-evaluation/playground"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Matching Evaluation playground
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/blocking-evaluation/playground"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Blocking Evaluation playground
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
