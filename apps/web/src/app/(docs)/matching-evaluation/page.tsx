import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Info,
} from "lucide-react";

import { CodeBlock } from "@/components/code-block";

const basicExample = `import {
  matchRecords,
  evaluateMatches,
} from "@matchforge/core";

const source = [
  { name: "Rahul Sharma" },
  { name: "Amit Patel" },
];

const target = [
  { fullName: "Rahul Sharma" },
  { fullName: "Amit Shah" },
];

// Generate matching predictions.
const predictions = matchRecords(source, target, {
  sourceKey: "name",
  targetKey: "fullName",
  method: "jaro-winkler",
  threshold: 0.8,
  topK: 1,
});

// Labelled source-target pairs.
const groundTruth = [
  { sourceIndex: 0, targetIndex: 0, isMatch: true },
  { sourceIndex: 0, targetIndex: 1, isMatch: false },
  { sourceIndex: 1, targetIndex: 0, isMatch: false },
  { sourceIndex: 1, targetIndex: 1, isMatch: false },
];

// Evaluate the predictions.
const evaluation = evaluateMatches({
  predictions,
  groundTruth,
});

console.log(evaluation.confusionMatrix);
console.log(evaluation.metrics);`;

const groundTruthExample = `const groundTruth = [
  {
    sourceIndex: 0,
    targetIndex: 0,
    isMatch: true,
  },
  {
    sourceIndex: 0,
    targetIndex: 1,
    isMatch: false,
  },
  {
    sourceIndex: 1,
    targetIndex: 0,
    isMatch: false,
  },
];`;

const resultExample = `{
  confusionMatrix: {
    truePositives: 1,
    falsePositives: 1,
    falseNegatives: 1,
    trueNegatives: 1,
  },
  metrics: {
    precision: 0.5,
    recall: 0.5,
    f1Score: 0.5,
    accuracy: 0.5,
  },
  totalEvaluatedPairs: 4,
}`;

const metrics = [
  {
    name: "Precision",
    formula: "TP / (TP + FP)",
    description:
      "Of all pairs predicted as matches, how many are actually matches? Higher precision means fewer incorrect matches.",
  },
  {
    name: "Recall",
    formula: "TP / (TP + FN)",
    description:
      "Of all actual matches in the labelled data, how many did the matching system identify? Higher recall means fewer missed matches.",
  },
  {
    name: "F1-score",
    formula: "2 × (Precision × Recall) / (Precision + Recall)",
    description:
      "The harmonic mean of precision and recall. It provides a balance between finding genuine matches and avoiding incorrect matches.",
  },
  {
    name: "Accuracy",
    formula: "(TP + TN) / (TP + FP + FN + TN)",
    description:
      "The proportion of correctly predicted pairs among all labelled pairs evaluated.",
  },
];

const confusionMatrix = [
  {
    name: "True Positive (TP)",
    description: "A genuine match correctly predicted as a match.",
    value: "Predicted match · Actual match",
  },
  {
    name: "False Positive (FP)",
    description: "A non-match incorrectly predicted as a match.",
    value: "Predicted match · Actual non-match",
  },
  {
    name: "False Negative (FN)",
    description: "A genuine match that was not predicted.",
    value: "Predicted non-match · Actual match",
  },
  {
    name: "True Negative (TN)",
    description: "A non-match correctly predicted as a non-match.",
    value: "Predicted non-match · Actual non-match",
  },
];

export default function MatchingEvaluationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-primary">
            <Blocks className="size-4" />
            Matching-Evaluation
          </div>
          {/* Header */}
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Matching evaluation
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Matching evaluation measures how accurately a record-matching system
            identifies matching and non-matching record pairs. MatchForge
            provides{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
              evaluateMatches()
            </code>{" "}
            to compare matching predictions against labelled ground-truth pairs
            and calculate standard classification metrics.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/matching-evaluation/playground"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open playground
              <ArrowUpRight className="size-4" />
            </Link>

            <Link
              href="#basic-usage"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Explore documentation
              <ArrowDown className="size-4" />
            </Link>
          </div>

          <div className="my-10 border-t border-border" />

          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              How matching evaluation works
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              A matching system compares records and generates candidate matches
              based on similarity scores and matching configuration. Evaluation
              checks these predictions against known labels to determine how
              well the system performs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-medium text-primary">01</p>
                <h3 className="mt-2 text-sm font-semibold">
                  Generate predictions
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Use matchRecords() to generate predicted source-target
                  matches.
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-medium text-primary">02</p>
                <h3 className="mt-2 text-sm font-semibold">
                  Provide ground truth
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Supply labelled pairs indicating actual matches and
                  non-matches.
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-medium text-primary">03</p>
                <h3 className="mt-2 text-sm font-semibold">
                  Calculate metrics
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Evaluate predictions using precision, recall, F1-score, and
                  accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Ground truth */}
          <section id="ground-truth" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Ground truth
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Ground truth is a collection of labelled source-target pairs. Each
              pair identifies two records using their original dataset indexes
              and specifies whether they represent the same entity.
            </p>

            <div className="mt-5">
              <CodeBlock code={groundTruthExample} language="typescript" />
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Property</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">sourceIndex</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Zero-based index of the record in the source dataset.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">targetIndex</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Zero-based index of the record in the target dataset.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">isMatch</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      True if the pair represents the same entity; otherwise,
                      false.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-3 rounded-lg border border-primary/20 bg-accent/40 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                Ground-truth indexes refer to the original input dataset
                positions and start at zero. Each source-target pair must be
                labelled only once. Duplicate labelled pairs are rejected.
              </p>
            </div>
          </section>

          {/* Confusion matrix */}
          <section id="confusion-matrix" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Confusion matrix
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The confusion matrix summarizes the four possible outcomes when
              comparing predicted matches against ground truth.
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[1fr_1fr]">
                <div className="border-b border-r border-border bg-muted/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Predicted outcome
                  </p>
                  <p className="mt-1 text-sm font-semibold">Match</p>
                </div>

                <div className="border-b border-border bg-muted/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Predicted outcome
                  </p>
                  <p className="mt-1 text-sm font-semibold">Non-match</p>
                </div>

                <div className="border-b border-r border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Actually a match
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    True Positive (TP)
                  </p>
                </div>

                <div className="border-b border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Actually a match
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    False Negative (FN)
                  </p>
                </div>

                <div className="border-r border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Actually a non-match
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    False Positive (FP)
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-xs text-muted-foreground">
                    Actually a non-match
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    True Negative (TN)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {confusionMatrix.map((item) => (
                <div
                  key={item.name}
                  className="border-b border-border pb-4 last:border-0"
                >
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-primary">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              A pair is considered predicted as a match when it appears in the
              matching predictions. A labelled pair that does not appear in the
              predictions is treated as a predicted non-match.
            </p>
          </section>

          {/* Metrics */}
          <section id="metrics" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Evaluation metrics
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge calculates four metrics from the confusion matrix. Each
              metric is returned as a decimal value between 0 and 1.
            </p>

            <div className="mt-6 space-y-5">
              {metrics.map((metric) => (
                <div
                  key={metric.name}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{metric.name}</h3>

                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-primary">
                      {metric.formula}
                    </code>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3 rounded-lg border border-primary/20 bg-accent/40 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                When a metric&apos;s denominator is zero, MatchForge returns 0
                for that metric. Accuracy alone can be misleading when the
                dataset contains many more non-matches than matches. Consider
                precision, recall, and F1-score together.
              </p>
            </div>
          </section>

          {/* Basic usage */}
          <section id="basic-usage" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              First, generate matching predictions using{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                matchRecords()
              </code>
              . Then prepare labelled ground-truth pairs and pass both to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                evaluateMatches()
              </code>
              .
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
          </section>

          {/* API */}
          <section id="api-reference" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              API reference
            </h2>

            <h3 className="mt-6 text-sm font-semibold">evaluateMatches()</h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Evaluates matching predictions against labelled ground-truth pairs
              and returns a confusion matrix and evaluation metrics.
            </p>

            <div className="mt-4 rounded-lg border border-border p-4">
              <p className="font-mono text-xs leading-6">
                evaluateMatches(options: EvaluationOptions)
              </p>
            </div>

            <h3 className="mt-6 text-sm font-semibold">EvaluationOptions</h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The evaluator accepts the predictions returned by{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                matchRecords()
              </code>{" "}
              and the labelled ground-truth pairs.
            </p>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Option</th>
                    <th className="px-3 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">predictions</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      MatchingResult
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Matching predictions returned by matchRecords().
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">groundTruth</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      GroundTruthPair[]
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Labelled source-target pairs with their actual match
                      status.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-8 text-sm font-semibold">EvaluationResult</h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The function returns the confusion matrix, calculated metrics, and
              the number of labelled pairs evaluated.
            </p>

            <div className="mt-4">
              <CodeBlock code={resultExample} language="typescript" />
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Property</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">
                      confusionMatrix
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Counts of true positives, false positives, false
                      negatives, and true negatives.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">metrics</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Precision, recall, F1-score, and accuracy.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 font-mono text-xs">
                      totalEvaluatedPairs
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      Number of explicitly labelled ground-truth pairs
                      evaluated.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Important considerations */}
          <section id="considerations" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Important considerations
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold">
                  Unlabelled pairs are ignored
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Only explicitly labelled ground-truth pairs contribute to the
                  evaluation. An unlabelled pair is not automatically treated as
                  a non-match or included in the confusion matrix.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Predictions depend on matching configuration
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  The similarity threshold and topK settings in{" "}
                  <code className="rounded bg-muted px-1 text-foreground">
                    matchRecords()
                  </code>{" "}
                  affect which pairs appear in the predictions. Changing these
                  settings can change the evaluation metrics.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Missing genuine matches count as false negatives
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  If a ground-truth pair is labelled as a match but does not
                  appear in the matching predictions, it contributes to the
                  false-negative count.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Labelled non-matches are important
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Include representative non-matching pairs in the ground truth.
                  Without labelled non-matches, false positives and true
                  negatives cannot be evaluated reliably.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Use representative labelled data
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Evaluation results are only as useful as the labelled pairs
                  supplied. Include representative matches and non-matches that
                  reflect the data your matching system will process.
                </p>
              </div>
            </div>
          </section>

          {/* Next */}
          <div className="mt-12 rounded-lg border border-border p-5">
            <p className="text-xs font-medium text-primary">NEXT STEP</p>

            <h2 className="mt-2 text-lg font-semibold">
              Experiment with matching evaluation
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Configure matching predictions, provide labelled pairs, and
              inspect the resulting confusion matrix and evaluation metrics.
            </p>

            <Link
              href="/matching-evaluation/playground"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Open matching evaluation playground
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>

        {/* Table of contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>

            <nav className="space-y-3 text-xs text-muted-foreground">
              {[
                ["overview", "Overview"],
                ["ground-truth", "Ground truth"],
                ["confusion-matrix", "Confusion matrix"],
                ["metrics", "Evaluation metrics"],
                ["basic-usage", "Basic usage"],
                ["api-reference", "API reference"],
                ["considerations", "Important considerations"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
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
