"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Info,
  Plus,
  Play,
  RotateCcw,
  Trash2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  matchRecords,
  compareStrings,
  evaluateMatches,
  type SimilarityMethod,
  type GroundTruthPair,
  type EvaluationResult,
  type MatchingResult,
} from "@matchforge/core";

import { Button } from "@/components/ui/button";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type SourceRecord = {
  customerId: string;
  name: string;
};

type TargetRecord = {
  customerId: string;
  fullName: string;
};

type LabelledPair = GroundTruthPair & {
  id: number;
};

type RunResult = {
  predictions: MatchingResult<SourceRecord, TargetRecord>;
  evaluation: EvaluationResult;
};

type Outcome =
  | "True Positive"
  | "False Positive"
  | "False Negative"
  | "True Negative";

// -----------------------------------------------------------------------------
// Demo data
// -----------------------------------------------------------------------------

const demoSource: SourceRecord[] = [
  { customerId: "A-1001", name: "Rahul Sharma" },
  { customerId: "A-1002", name: "Amit Patel" },
  { customerId: "A-1003", name: "Priya Shah" },
  { customerId: "A-1004", name: "Neha Verma" },
  { customerId: "A-1005", name: "Vikram Singh" },
];

const demoTarget: TargetRecord[] = [
  { customerId: "B-2001", fullName: "Rahul Sharma" },
  { customerId: "B-2002", fullName: "Amit Patel" },
  { customerId: "B-2003", fullName: "Amit R Patel" },
  { customerId: "B-2004", fullName: "Priya S" },
  { customerId: "B-2005", fullName: "Nisha Verma" },
  { customerId: "B-2006", fullName: "Vikram Singh" },
  { customerId: "B-2007", fullName: "Rohan Mehta" },
];

// Only selected pairs are labelled.
// The customer IDs establish actual identity; they are not matching fields.
const initialGroundTruth: LabelledPair[] = [
  { id: 1, sourceIndex: 0, targetIndex: 0, isMatch: true },
  { id: 2, sourceIndex: 1, targetIndex: 2, isMatch: true },
  { id: 3, sourceIndex: 2, targetIndex: 3, isMatch: true },
  { id: 4, sourceIndex: 3, targetIndex: 4, isMatch: true },

  { id: 5, sourceIndex: 1, targetIndex: 1, isMatch: false },
  { id: 6, sourceIndex: 4, targetIndex: 5, isMatch: false },
  { id: 7, sourceIndex: 0, targetIndex: 1, isMatch: false },
  { id: 8, sourceIndex: 4, targetIndex: 6, isMatch: false },
];

const algorithms: {
  value: SimilarityMethod;
  label: string;
}[] = [
  { value: "levenshtein", label: "Levenshtein" },
  { value: "damerau-levenshtein", label: "Damerau-Levenshtein" },
  { value: "jaro", label: "Jaro" },
  { value: "jaro-winkler", label: "Jaro-Winkler" },
  { value: "jaccard", label: "Jaccard" },
  { value: "dice", label: "Dice" },
  { value: "cosine", label: "Cosine" },
  { value: "soundex", label: "Soundex" },
  { value: "metaphone", label: "Metaphone" },
];

// -----------------------------------------------------------------------------
// Shared styles and helpers
// -----------------------------------------------------------------------------

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const mutedClass = "text-xs leading-5 text-muted-foreground";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function getPairKey(sourceIndex: number, targetIndex: number) {
  return `${sourceIndex}:${targetIndex}`;
}

function getOutcome(isMatch: boolean, predicted: boolean): Outcome {
  if (isMatch && predicted) return "True Positive";
  if (!isMatch && predicted) return "False Positive";
  if (isMatch && !predicted) return "False Negative";
  return "True Negative";
}

// -----------------------------------------------------------------------------
// Reusable components
// -----------------------------------------------------------------------------

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-primary">{number}</span>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>

      <p className={`mt-1 pl-7 ${mutedClass}`}>{description}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/20"
    >
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>

      <p className={`mt-1 ${mutedClass}`}>{description}</p>
    </motion.div>
  );
}

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const correct = outcome === "True Positive" || outcome === "True Negative";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${
        correct
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {outcome}
    </span>
  );
}

function SummaryItem({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs font-medium">{label}</p>
      <p className={`mt-1 ${mutedClass}`}>{description}</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Playground
// -----------------------------------------------------------------------------

export default function MatchingEvaluationPlaygroundPage() {
  const [source, setSource] = useState<SourceRecord[]>(demoSource);
  const [target, setTarget] = useState<TargetRecord[]>(demoTarget);

  const [method, setMethod] = useState<SimilarityMethod>("jaro-winkler");

  const [threshold, setThreshold] = useState(0.8);
  const [topK, setTopK] = useState(1);

  const [groundTruth, setGroundTruth] =
    useState<LabelledPair[]>(initialGroundTruth);

  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState("");
  const [showGroundTruth, setShowGroundTruth] = useState(false);

  const invalidateResults = () => {
    setResult(null);
    setError("");
  };

  // ---------------------------------------------------------------------------
  // Ground-truth editing
  // ---------------------------------------------------------------------------

  const updateGroundTruth = (id: number, updates: Partial<GroundTruthPair>) => {
    setGroundTruth((current) =>
      current.map((pair) => (pair.id === id ? { ...pair, ...updates } : pair)),
    );

    invalidateResults();
  };

  const addGroundTruthPair = () => {
    const nextId = Math.max(0, ...groundTruth.map((pair) => pair.id)) + 1;

    setGroundTruth((current) => [
      ...current,
      {
        id: nextId,
        sourceIndex: 0,
        targetIndex: 0,
        isMatch: true,
      },
    ]);

    setShowGroundTruth(true);
    invalidateResults();
  };

  const removeGroundTruthPair = (id: number) => {
    setGroundTruth((current) => current.filter((pair) => pair.id !== id));

    invalidateResults();
  };

  const resetLabels = () => {
    setGroundTruth(initialGroundTruth);
    invalidateResults();
  };

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = () => {
    setSource(demoSource);
    setTarget(demoTarget);
    setMethod("jaro-winkler");
    setThreshold(0.8);
    setTopK(1);
    setGroundTruth(initialGroundTruth);
    setShowGroundTruth(false);
    setResult(null);
    setError("");
  };

  // ---------------------------------------------------------------------------
  // Evaluation
  // ---------------------------------------------------------------------------

  const runEvaluation = () => {
    setError("");
    setResult(null);

    if (!source.length || !target.length) {
      setError("Both datasets must contain records.");
      return;
    }

    if (!groundTruth.length) {
      setError("Add at least one labelled pair before evaluating.");
      return;
    }

    if (!Number.isInteger(topK) || topK < 1) {
      setError("topK must be a positive integer.");
      return;
    }

    if (
      groundTruth.some(
        (pair) =>
          !Number.isInteger(pair.sourceIndex) ||
          !Number.isInteger(pair.targetIndex) ||
          pair.sourceIndex < 0 ||
          pair.sourceIndex >= source.length ||
          pair.targetIndex < 0 ||
          pair.targetIndex >= target.length,
      )
    ) {
      setError("Every ground-truth pair must reference valid records.");
      return;
    }

    const seenPairs = new Set<string>();

    for (const pair of groundTruth) {
      const key = getPairKey(pair.sourceIndex, pair.targetIndex);

      if (seenPairs.has(key)) {
        setError(
          `Duplicate ground-truth pair: (${pair.sourceIndex}, ${pair.targetIndex}). Remove duplicate labels before evaluating.`,
        );
        return;
      }

      seenPairs.add(key);
    }

    try {
      const predictions = matchRecords(source, target, {
        sourceKey: "name",
        targetKey: "fullName",
        method,
        threshold,
        topK,
      });

      const evaluation = evaluateMatches({
        predictions,
        groundTruth: groundTruth.map(
          ({ sourceIndex, targetIndex, isMatch }) => ({
            sourceIndex,
            targetIndex,
            isMatch,
          }),
        ),
      });

      setResult({ predictions, evaluation });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to evaluate matching results.",
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Derived results
  // ---------------------------------------------------------------------------

  const predictedPairs = new Set<string>();

  if (result) {
    result.predictions.matches.forEach((match) => {
      match.candidates.forEach((candidate) => {
        predictedPairs.add(
          getPairKey(match.sourceIndex, candidate.targetIndex),
        );
      });
    });
  }

  const totalPossiblePairs = source.length * target.length;
  const totalPredictedPairs = predictedPairs.size;

  const matchedSourceRecords =
    result?.predictions.matches.filter((match) => match.matched).length ?? 0;

  const labelledMatches = groundTruth.filter((pair) => pair.isMatch).length;

  const labelledNonMatches = groundTruth.length - labelledMatches;

  const duplicatePairs =
    new Set(
      groundTruth.map((pair) => getPairKey(pair.sourceIndex, pair.targetIndex)),
    ).size !== groundTruth.length;

  const matrix = result?.evaluation.confusionMatrix;
  const metrics = result?.evaluation.metrics;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="mx-auto max-w-6xl space-y-8 overflow-x-hidden px-5 py-8 sm:px-7">
      {/* Header */}
      <header>
        <Link
          href="/matching-evaluation"
          className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Matching evaluation documentation
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-primary">
              MATCHFORGE PLAYGROUND
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Matching evaluation
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Generate matching predictions, compare them with verified
              ground-truth pairs, and evaluate performance using classification
              metrics.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="shrink-0"
          >
            <RotateCcw />
            Reset demo
          </Button>
        </div>
      </header>

      {/* Demo scenario */}
      <section className="rounded-lg border border-border p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Understanding this demo</h2>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Imagine merging customer records from two different systems. The same
          customer may have slightly different names, while different customers
          may even share identical names.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-xs font-semibold">System A</p>
            <p className={`mt-1 ${mutedClass}`}>Original customer records</p>
            <p className="mt-2 font-mono text-xs">A-1002 · Amit Patel</p>
          </div>

          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-xs font-semibold">System B</p>
            <p className={`mt-1 ${mutedClass}`}>
              Records from another database
            </p>
            <p className="mt-2 font-mono text-xs">B-2002 · Amit Patel</p>
            <p className="mt-1 font-mono text-xs">B-2003 · Amit R Patel</p>
          </div>
        </div>

        <p className={`mt-4 ${mutedClass}`}>
          Matching uses names only. Customer IDs establish the actual identity
          of records and are used only for ground-truth labels.
        </p>
      </section>

      {/* Workflow */}
      <section className="rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">01</p>
            <p className="mt-1 text-sm font-semibold">Matching predictions</p>
            <p className={mutedClass}>
              Generate predicted pairs using matchRecords().
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">02</p>
            <p className="mt-1 text-sm font-semibold">Ground truth</p>
            <p className={mutedClass}>
              Provide verified match and non-match labels.
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">03</p>
            <p className="mt-1 text-sm font-semibold">Evaluation</p>
            <p className={mutedClass}>
              Calculate metrics using evaluateMatches().
            </p>
          </div>
        </div>
      </section>

      {/* Matching configuration */}
      <section>
        <SectionHeading
          number="01"
          title="Matching configuration"
          description="Configure how MatchForge generates its predictions."
        />

        <div className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs font-medium text-muted-foreground">
              Similarity algorithm
            </span>

            <select
              className={inputClass}
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as SimilarityMethod);
                invalidateResults();
              }}
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.value} value={algorithm.value}>
                  {algorithm.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs font-medium text-muted-foreground">
              Maximum candidates per source record (topK)
            </span>

            <input
              type="number"
              min={1}
              step={1}
              value={topK}
              onChange={(event) => {
                setTopK(
                  event.target.value === "" ? 1 : Number(event.target.value),
                );
                invalidateResults();
              }}
              className={inputClass}
            />
          </label>

          <div className="sm:col-span-2">
            <div className="mb-2 flex justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Similarity threshold
              </label>

              <span className="font-mono text-sm font-semibold text-primary">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={threshold}
              onChange={(event) => {
                setThreshold(Number(event.target.value));
                invalidateResults();
              }}
              className="h-2 w-full cursor-pointer accent-primary"
            />

            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>0 · More candidates</span>
              <span>1 · Stricter matching</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Datasets */}
      <section>
        <SectionHeading
          number="02"
          title="Input datasets"
          description="Edit the customer names to experiment with different matching scenarios."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Source */}
          <div className="min-w-0 rounded-lg border border-border">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Source dataset</p>
              <p className={mutedClass}>{source.length} records · name</p>
            </div>

            <div className="divide-y divide-border">
              {source.map((record, index) => (
                <div
                  key={record.customerId}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-16 shrink-0">
                    <p className="font-mono text-xs text-muted-foreground">
                      {index}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {record.customerId}
                    </p>
                  </div>

                  <input
                    value={record.name}
                    onChange={(event) => {
                      setSource((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      );
                      invalidateResults();
                    }}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    aria-label={`Source customer ${index + 1} name`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="min-w-0 rounded-lg border border-border">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Target dataset</p>
              <p className={mutedClass}>{target.length} records · fullName</p>
            </div>

            <div className="divide-y divide-border">
              {target.map((record, index) => (
                <div
                  key={record.customerId}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-16 shrink-0">
                    <p className="font-mono text-xs text-muted-foreground">
                      {index}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {record.customerId}
                    </p>
                  </div>

                  <input
                    value={record.fullName}
                    onChange={(event) => {
                      setTarget((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, fullName: event.target.value }
                            : item,
                        ),
                      );
                      invalidateResults();
                    }}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    aria-label={`Target customer ${index + 1} name`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className={`mt-3 ${mutedClass}`}>
          Customer IDs are reference information only. They are not passed to
          the matching algorithm.
        </p>
      </section>

      <div className="border-t border-border" />

      {/* Ground truth */}
      <section>
        <SectionHeading
          number="03"
          title="Ground-truth labels"
          description="A small set of manually verified pairs used to evaluate matching predictions."
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xl font-semibold tabular-nums">
              {groundTruth.length}
            </p>
            <p className={mutedClass}>Labelled pairs</p>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-xl font-semibold tabular-nums">
              {labelledMatches}
            </p>
            <p className={mutedClass}>Actual matches</p>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-xl font-semibold tabular-nums">
              {labelledNonMatches}
            </p>
            <p className={mutedClass}>Non-matches</p>
          </div>
        </div>

        {/* Compact editor */}
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setShowGroundTruth((current) => !current)}
            aria-expanded={showGroundTruth}
            className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/30"
          >
            <div>
              <p className="text-sm font-semibold">
                View and edit labelled pairs
              </p>
              <p className={mutedClass}>
                Manage the examples used as ground truth.
              </p>
            </div>

            <motion.span
              animate={{ rotate: showGroundTruth ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="size-4 text-muted-foreground" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {showGroundTruth && (
              <motion.div
                key="ground-truth-editor"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <p className={mutedClass}>
                      Select whether each pair represents the same customer.
                    </p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetLabels}>
                        <RotateCcw />
                        Reset
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addGroundTruthPair}
                      >
                        <Plus />
                        Add pair
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-3 font-medium">
                            Source record
                          </th>
                          <th className="px-3 py-3 font-medium">
                            Target record
                          </th>
                          <th className="px-3 py-3 font-medium">
                            Actual label
                          </th>
                          <th className="w-10 px-3 py-3" />
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {groundTruth.map((pair, index) => (
                          <tr key={pair.id}>
                            <td className="px-3 py-2">
                              <select
                                className={inputClass}
                                value={pair.sourceIndex}
                                onChange={(event) =>
                                  updateGroundTruth(pair.id, {
                                    sourceIndex: Number(event.target.value),
                                  })
                                }
                              >
                                {source.map((record, i) => (
                                  <option key={i} value={i}>
                                    {record.customerId} · {record.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="px-3 py-2">
                              <select
                                className={inputClass}
                                value={pair.targetIndex}
                                onChange={(event) =>
                                  updateGroundTruth(pair.id, {
                                    targetIndex: Number(event.target.value),
                                  })
                                }
                              >
                                {target.map((record, i) => (
                                  <option key={i} value={i}>
                                    {record.customerId} · {record.fullName}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="px-3 py-2">
                              <select
                                className={inputClass}
                                value={String(pair.isMatch)}
                                onChange={(event) =>
                                  updateGroundTruth(pair.id, {
                                    isMatch: event.target.value === "true",
                                  })
                                }
                              >
                                <option value="true">Match</option>
                                <option value="false">Non-match</option>
                              </select>
                            </td>

                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeGroundTruthPair(pair.id)}
                                aria-label={`Remove pair ${index + 1}`}
                                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-border p-3">
                    <p className={mutedClass}>
                      Only explicitly labelled pairs are evaluated. Unlabelled
                      pairs are excluded, not automatically considered
                      non-matches.
                    </p>

                    {duplicatePairs && (
                      <p className="mt-2 text-xs text-destructive">
                        Duplicate source-target pairs detected. Remove
                        duplicates before evaluating.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Run evaluation */}
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">Ready to evaluate?</p>
          <p className={`mt-1 ${mutedClass}`}>
            Generate predictions and compare them with your labels.
          </p>
        </div>

        <Button
          onClick={runEvaluation}
          className="sm:min-w-48"
          disabled={
            !source.length ||
            !target.length ||
            !groundTruth.length ||
            duplicatePairs
          }
        >
          <Play />
          Run evaluation
        </Button>
      </section>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="evaluation-error"
            {...fadeIn}
            transition={{ duration: 0.2 }}
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && matrix && metrics && (
          <motion.section
            key="evaluation-results"
            {...fadeIn}
            transition={{ duration: 0.25 }}
            className="space-y-8 border-t border-border pt-7"
          >
            {/* Results heading */}
            <div>
              <p className="text-xs font-medium text-primary">
                04 / EVALUATION RESULTS
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Evaluation summary
              </h2>

              <p className={`mt-1 ${mutedClass}`}>
                Evaluated {result.evaluation.totalEvaluatedPairs} labelled
                source-target pairs.
              </p>
            </div>

            {/* Metrics */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-3 sm:grid-cols-2"
            >
              <MetricCard
                label="Precision"
                value={formatPercent(metrics.precision)}
                description="How many predicted matches were correct?"
              />

              <MetricCard
                label="Recall"
                value={formatPercent(metrics.recall)}
                description="How many actual matches were found?"
              />

              <MetricCard
                label="F1-score"
                value={formatPercent(metrics.f1Score)}
                description="Balance between precision and recall."
              />

              <MetricCard
                label="Accuracy"
                value={formatPercent(metrics.accuracy)}
                description="Correct predictions among evaluated pairs."
              />
            </motion.div>

            {/* Confusion matrix */}
            <div>
              <h3 className="text-sm font-semibold">Confusion matrix</h3>

              <p className={`mt-1 ${mutedClass}`}>
                Rows represent actual labels; columns represent predicted
                labels.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden rounded-lg border border-border"
              >
                <div className="grid grid-cols-[1fr_1fr_1fr] bg-muted/40">
                  <div className="p-3">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      ACTUAL / PREDICTED
                    </span>
                  </div>

                  <div className="border-l border-border p-3 text-center">
                    <span className="text-xs font-semibold">Match</span>
                  </div>

                  <div className="border-l border-border p-3 text-center">
                    <span className="text-xs font-semibold">Non-match</span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] border-t border-border">
                  <div className="flex items-center p-3">
                    <span className="text-xs font-medium">Match</span>
                  </div>

                  <div className="border-l border-border bg-primary/5 p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">
                      True Positive
                    </p>
                    <motion.p
                      key={matrix.truePositives}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-2xl font-semibold tabular-nums"
                    >
                      {matrix.truePositives}
                    </motion.p>
                  </div>

                  <div className="border-l border-border bg-muted/20 p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">
                      False Negative
                    </p>
                    <motion.p
                      key={matrix.falseNegatives}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-2xl font-semibold tabular-nums"
                    >
                      {matrix.falseNegatives}
                    </motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] border-t border-border">
                  <div className="flex items-center p-3">
                    <span className="text-xs font-medium">Non-match</span>
                  </div>

                  <div className="border-l border-border bg-muted/20 p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">
                      False Positive
                    </p>
                    <motion.p
                      key={matrix.falsePositives}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-2xl font-semibold tabular-nums"
                    >
                      {matrix.falsePositives}
                    </motion.p>
                  </div>

                  <div className="border-l border-border bg-primary/5 p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">
                      True Negative
                    </p>
                    <motion.p
                      key={matrix.trueNegatives}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-2xl font-semibold tabular-nums"
                    >
                      {matrix.trueNegatives}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Prediction summary */}
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">Prediction summary</h3>

              <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <SummaryItem
                  label="Possible pairs"
                  value={totalPossiblePairs}
                  description="Source × target records"
                />

                <SummaryItem
                  label="Predicted pairs"
                  value={totalPredictedPairs}
                  description="Pairs returned as candidates"
                />

                <SummaryItem
                  label="Matched sources"
                  value={matchedSourceRecords}
                  description="Source records with matches"
                />

                <SummaryItem
                  label="Evaluated pairs"
                  value={result.evaluation.totalEvaluatedPairs}
                  description="Explicitly labelled pairs"
                />
              </div>
            </div>

            {/* Pair-level evaluation */}
            <div>
              <h3 className="text-sm font-semibold">Pair-level evaluation</h3>

              <p className={`mt-1 ${mutedClass}`}>
                Inspect similarity scores, predictions, actual labels, and
                classification outcomes for each labelled pair.
              </p>

              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[800px] text-left text-xs">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-3 font-medium">Source</th>
                      <th className="px-3 py-3 font-medium">Target</th>
                      <th className="px-3 py-3 text-right font-medium">
                        Similarity
                      </th>
                      <th className="px-3 py-3 font-medium">Predicted</th>
                      <th className="px-3 py-3 font-medium">Actual</th>
                      <th className="px-3 py-3 font-medium">Outcome</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {groundTruth.map((pair) => {
                      const sourceRecord = source[pair.sourceIndex];
                      const targetRecord = target[pair.targetIndex];

                      const score = compareStrings(
                        sourceRecord.name,
                        targetRecord.fullName,
                        { method },
                      );

                      const predicted = predictedPairs.has(
                        getPairKey(pair.sourceIndex, pair.targetIndex),
                      );

                      const outcome = getOutcome(pair.isMatch, predicted);

                      return (
                        <tr
                          key={pair.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-3 py-3">
                            <p className="font-medium">{sourceRecord.name}</p>
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                              {sourceRecord.customerId}
                            </p>
                          </td>

                          <td className="px-3 py-3">
                            <p className="font-medium">
                              {targetRecord.fullName}
                            </p>
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                              {targetRecord.customerId}
                            </p>
                          </td>

                          <td className="px-3 py-3 text-right font-mono tabular-nums">
                            {formatPercent(score)}
                          </td>

                          <td className="px-3 py-3">
                            {predicted ? "Match" : "Non-match"}
                          </td>

                          <td className="px-3 py-3">
                            {pair.isMatch ? "Match" : "Non-match"}
                          </td>

                          <td className="px-3 py-3">
                            <OutcomeBadge outcome={outcome} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className={`mt-2 ${mutedClass}`}>
                Similarity scores are calculated independently of candidate
                selection. A pair can have a high score but still not be
                returned if it falls outside topK.
              </p>
            </div>

            {/* Interpretation */}
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="text-sm font-semibold">
                Interpreting the results
              </h3>

              <div className="mt-3 space-y-3">
                {metrics.precision > metrics.recall ? (
                  <p className={mutedClass}>
                    <strong className="text-foreground">
                      Precision is higher than recall.
                    </strong>{" "}
                    The predictions are relatively selective, but some labelled
                    genuine matches may be missed.
                  </p>
                ) : metrics.recall > metrics.precision ? (
                  <p className={mutedClass}>
                    <strong className="text-foreground">
                      Recall is higher than precision.
                    </strong>{" "}
                    More labelled genuine matches are being found, but some
                    predicted matches may be incorrect.
                  </p>
                ) : (
                  <p className={mutedClass}>
                    <strong className="text-foreground">
                      Precision and recall are equal.
                    </strong>{" "}
                    Both metrics currently have the same value on the labelled
                    pairs.
                  </p>
                )}

                <p className={mutedClass}>
                  Change the similarity threshold or topK and run evaluation
                  again to observe how the predictions and metrics change.
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
