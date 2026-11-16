"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  Target,
  TrendingDown,
  Layers3,
} from "lucide-react";

import {
  evaluateBlocking,
  generateCandidates,
  type BlockingMethod,
  type BlockingRule,
  type NormalizeOptions,
} from "@matchforge/core";

import { Button } from "@/components/ui/button";

import { DatasetPanel } from "@/app/(docs)/record-matching/components/dataset-panel";

import { demoSource, demoTarget } from "../../../../data/record-matching";

import type { Dataset } from "../../record-matching/types";

type RuleItem = BlockingRule & {
  id: number;
};

type LabelledPair = {
  id: number;
  sourceIndex: number;
  targetIndex: number;
  isMatch: boolean;
};

type EvaluationRun = {
  candidates: ReturnType<typeof generateCandidates>;
  evaluation: ReturnType<typeof evaluateBlocking>;
};

const initialRules: RuleItem[] = [
  {
    id: 1,
    sourceKey: "customer_name",
    targetKey: "full_name",
    method: "prefix",
    length: 3,
  },
  {
    id: 2,
    sourceKey: "city",
    targetKey: "location",
    method: "exact",
  },
];

const initialNormalization: NormalizeOptions = {
  lowercase: true,
  trim: true,
  normalizeWhitespace: true,
  removePunctuation: false,
  removeAccents: false,
};

const initialGroundTruth: LabelledPair[] = [
  { id: 1, sourceIndex: 0, targetIndex: 0, isMatch: true },
  { id: 2, sourceIndex: 1, targetIndex: 1, isMatch: true },
  { id: 3, sourceIndex: 2, targetIndex: 2, isMatch: true },
  { id: 4, sourceIndex: 3, targetIndex: 3, isMatch: true },
  { id: 5, sourceIndex: 0, targetIndex: 4, isMatch: false },
  { id: 6, sourceIndex: 4, targetIndex: 1, isMatch: false },
];

const normalizationOptions: {
  key: keyof NormalizeOptions;
  label: string;
}[] = [
  { key: "lowercase", label: "Lowercase" },
  { key: "trim", label: "Trim surrounding whitespace" },
  { key: "normalizeWhitespace", label: "Normalize whitespace" },
  { key: "removePunctuation", label: "Remove punctuation" },
  { key: "removeAccents", label: "Remove accents" },
];

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const mutedClass = "text-xs leading-5 text-muted-foreground";

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
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className={`mt-1 ${mutedClass}`}>{description}</p>
    </div>
  );
}

export default function BlockingEvaluationPlaygroundPage() {
  const [source, setSource] = useState<Dataset>(demoSource);
  const [target, setTarget] = useState<Dataset>(demoTarget);

  const [rules, setRules] = useState<RuleItem[]>(initialRules);
  const [normalization, setNormalization] =
    useState<NormalizeOptions>(initialNormalization);

  const [groundTruth, setGroundTruth] =
    useState<LabelledPair[]>(initialGroundTruth);

  const [result, setResult] = useState<EvaluationRun | null>(null);
  const [error, setError] = useState("");

  const invalidateResults = () => {
    setResult(null);
    setError("");
  };

  const updateSource = (dataset: Dataset) => {
    setSource(dataset);
    setGroundTruth([]);
    invalidateResults();
  };

  const updateTarget = (dataset: Dataset) => {
    setTarget(dataset);
    setGroundTruth([]);
    invalidateResults();
  };

  const updateRule = (id: number, updates: Partial<BlockingRule>) => {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)),
    );
    invalidateResults();
  };

  const addRule = () => {
    if (!source.headers.length || !target.headers.length) return;

    setRules((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((rule) => rule.id)) + 1,
        sourceKey: source.headers[0],
        targetKey: target.headers[0],
        method: "exact",
      },
    ]);

    invalidateResults();
  };

  const removeRule = (id: number) => {
    setRules((current) => current.filter((rule) => rule.id !== id));
    invalidateResults();
  };

  const updateNormalization = (key: keyof NormalizeOptions, value: boolean) => {
    setNormalization((current) => ({
      ...current,
      [key]: value,
    }));
    invalidateResults();
  };

  const updateGroundTruth = (id: number, updates: Partial<LabelledPair>) => {
    setGroundTruth((current) =>
      current.map((pair) => (pair.id === id ? { ...pair, ...updates } : pair)),
    );
    invalidateResults();
  };

  const addGroundTruth = () => {
    if (!source.rows.length || !target.rows.length) return;

    const existing = new Set(
      groundTruth.map((pair) => `${pair.sourceIndex}:${pair.targetIndex}`),
    );

    let availablePair: { sourceIndex: number; targetIndex: number } | null =
      null;

    for (let sourceIndex = 0; sourceIndex < source.rows.length; sourceIndex++) {
      for (
        let targetIndex = 0;
        targetIndex < target.rows.length;
        targetIndex++
      ) {
        const key = `${sourceIndex}:${targetIndex}`;

        if (!existing.has(key)) {
          availablePair = { sourceIndex, targetIndex };
          break;
        }
      }

      if (availablePair) break;
    }

    if (!availablePair) {
      setError("Every possible source-target pair is already labelled.");
      return;
    }

    setGroundTruth((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((pair) => pair.id)) + 1,
        ...availablePair,
        isMatch: false,
      },
    ]);

    invalidateResults();
  };

  const removeGroundTruth = (id: number) => {
    setGroundTruth((current) => current.filter((pair) => pair.id !== id));
    invalidateResults();
  };

  const reset = () => {
    setSource(demoSource);
    setTarget(demoTarget);
    setRules(initialRules);
    setNormalization(initialNormalization);
    setGroundTruth(initialGroundTruth);
    setResult(null);
    setError("");
  };

  const runEvaluation = () => {
    setError("");
    setResult(null);

    if (!source.rows.length || !target.rows.length) {
      setError("Both datasets must contain at least one record.");
      return;
    }

    if (!rules.length) {
      setError("Add at least one blocking rule.");
      return;
    }

    const invalidRule = rules.some(
      (rule) =>
        !rule.sourceKey ||
        !rule.targetKey ||
        !source.headers.includes(rule.sourceKey) ||
        !target.headers.includes(rule.targetKey),
    );

    if (invalidRule) {
      setError("Choose valid fields for every blocking rule.");
      return;
    }

    const invalidPrefix = rules.some(
      (rule) =>
        rule.method === "prefix" &&
        rule.length !== undefined &&
        (!Number.isInteger(rule.length) || rule.length < 1),
    );

    if (invalidPrefix) {
      setError("Prefix length must be a positive integer.");
      return;
    }

    if (!groundTruth.length) {
      setError("Add at least one labelled ground-truth pair.");
      return;
    }

    const invalidPair = groundTruth.some(
      (pair) =>
        !Number.isInteger(pair.sourceIndex) ||
        !Number.isInteger(pair.targetIndex) ||
        pair.sourceIndex < 0 ||
        pair.sourceIndex >= source.rows.length ||
        pair.targetIndex < 0 ||
        pair.targetIndex >= target.rows.length,
    );

    if (invalidPair) {
      setError("Some ground-truth pairs contain invalid dataset indexes.");
      return;
    }

    const seen = new Set<string>();

    for (const pair of groundTruth) {
      const key = `${pair.sourceIndex}:${pair.targetIndex}`;

      if (seen.has(key)) {
        setError("Ground truth contains duplicate source-target pairs.");
        return;
      }

      seen.add(key);
    }

    try {
      const candidates = generateCandidates(source.rows, target.rows, {
        rules: rules.map(({ id, ...rule }) => rule),
        normalization,
      });

      const evaluation = evaluateBlocking({
        candidates,
        groundTruth: groundTruth.map(
          ({ sourceIndex, targetIndex, isMatch }) => ({
            sourceIndex,
            targetIndex,
            isMatch,
          }),
        ),
      });

      setResult({ candidates, evaluation });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Blocking evaluation failed.",
      );
    }
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const candidateSet = new Set(
    result?.candidates.pairs.map(
      (pair) => `${pair.sourceIndex}:${pair.targetIndex}`,
    ) ?? [],
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 overflow-x-hidden px-5 py-8 sm:px-7">
      {/* Header */}
      <header>
        <Link
          href="/blocking-evaluation"
          className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Blocking evaluation documentation
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-primary">
              MATCHFORGE PLAYGROUND
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Blocking evaluation
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Configure candidate generation, label known record pairs, and
              evaluate how effectively your blocking strategy reduces
              comparisons while retaining genuine matches.
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

      {/* Workflow */}
      <section className="rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div>
            <p className="text-xs text-muted-foreground">01 / INPUT</p>
            <p className="mt-1 text-sm font-semibold">Two datasets</p>
            <p className={mutedClass}>Source and target records</p>
          </div>

          <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />

          <div>
            <p className="text-xs text-muted-foreground">02 / GENERATE</p>
            <p className="mt-1 text-sm font-semibold">Candidate pairs</p>
            <p className={mutedClass}>Apply blocking rules</p>
          </div>

          <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />

          <div>
            <p className="text-xs text-muted-foreground">03 / EVALUATE</p>
            <p className="mt-1 text-sm font-semibold">Ground truth</p>
            <p className={mutedClass}>Calculate three metrics</p>
          </div>
        </div>
      </section>

      {/* Datasets */}
      <section>
        <SectionHeading
          number="01"
          title="Input datasets"
          description="Provide the source and target records used for candidate generation."
        />

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <DatasetPanel label="A" dataset={source} onChange={updateSource} />

          <DatasetPanel label="B" dataset={target} onChange={updateTarget} />
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Blocking rules */}
      <section>
        <SectionHeading
          number="02"
          title="Blocking configuration"
          description="Choose the fields and methods used to generate candidate pairs."
        />

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="grid min-w-0 gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_130px_130px_36px] xl:items-end"
            >
              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Source field · Rule {index + 1}
                </span>
                <select
                  className={inputClass}
                  value={rule.sourceKey}
                  onChange={(event) =>
                    updateRule(rule.id, {
                      sourceKey: event.target.value,
                    })
                  }
                >
                  {source.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>

              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Target field
                </span>
                <select
                  className={inputClass}
                  value={rule.targetKey}
                  onChange={(event) =>
                    updateRule(rule.id, {
                      targetKey: event.target.value,
                    })
                  }
                >
                  {target.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Blocking method
                </span>
                <select
                  className={inputClass}
                  value={rule.method}
                  onChange={(event) =>
                    updateRule(rule.id, {
                      method: event.target.value as BlockingMethod,
                    })
                  }
                >
                  <option value="exact">Exact</option>
                  <option value="prefix">Prefix</option>
                  <option value="soundex">Soundex</option>
                </select>
              </label>

              <div>
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Configuration
                </span>
                {rule.method === "prefix" ? (
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={rule.length ?? 3}
                    onChange={(event) =>
                      updateRule(rule.id, {
                        length:
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                      })
                    }
                    className={inputClass}
                    aria-label="Prefix length"
                  />
                ) : (
                  <div className="flex h-9 items-center text-xs text-muted-foreground">
                    Default settings
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeRule(rule.id)}
                aria-label={`Remove rule ${index + 1}`}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addRule}
          className="mt-3"
          disabled={!source.headers.length || !target.headers.length}
        >
          <Plus />
          Add blocking rule
        </Button>

        <div className="mt-4 flex gap-2 rounded-lg bg-muted/40 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className={mutedClass}>
            <strong className="font-medium text-foreground">OR logic:</strong> A
            pair is retained if it matches at least one blocking rule. Duplicate
            candidate pairs are removed.
          </p>
        </div>

        <details className="group mt-4 rounded-lg border border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-sm font-medium">Normalization settings</p>
              <p className={`mt-1 ${mutedClass}`}>
                Standardize values before generating blocking keys.
              </p>
            </div>
            <span className="text-xs text-muted-foreground transition group-open:rotate-180">
              ▼
            </span>
          </summary>

          <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
            {normalizationOptions.map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={Boolean(normalization[option.key])}
                  onChange={(event) =>
                    updateNormalization(option.key, event.target.checked)
                  }
                  className="size-4 accent-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </details>
      </section>

      <div className="border-t border-border" />

      {/* Ground truth */}
      <section>
        <SectionHeading
          number="03"
          title="Ground-truth labels"
          description="Label known source-target pairs as genuine matches or non-matches."
        />

        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">
              {groundTruth.length} labelled pairs
            </p>
            <p className={mutedClass}>
              These labels are used to evaluate candidate generation.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={addGroundTruth}
            disabled={
              !source.rows.length ||
              !target.rows.length ||
              groundTruth.length >= source.rows.length * target.rows.length
            }
          >
            <Plus />
            Add labelled pair
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {groundTruth.map((pair, index) => (
              <motion.div
                key={pair.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.16 }}
                className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_150px_36px] sm:items-end"
              >
                <label className="min-w-0">
                  <span className="mb-1.5 block text-xs text-muted-foreground">
                    Source record · Pair {index + 1}
                  </span>
                  <select
                    className={inputClass}
                    value={pair.sourceIndex}
                    onChange={(event) =>
                      updateGroundTruth(pair.id, {
                        sourceIndex: Number(event.target.value),
                      })
                    }
                  >
                    {source.rows.map(
                      (
                        record: Dataset["rows"][number],
                        recordIndex: number,
                      ) => (
                        <option key={recordIndex} value={recordIndex}>
                          #{recordIndex} ·{" "}
                          {String(record[source.headers[0]] ?? "Record")}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 block text-xs text-muted-foreground">
                    Target record
                  </span>
                  <select
                    className={inputClass}
                    value={pair.targetIndex}
                    onChange={(event) =>
                      updateGroundTruth(pair.id, {
                        targetIndex: Number(event.target.value),
                      })
                    }
                  >
                    {target.rows.map(
                      (record: Dataset["rows"][number], recordIndex) => (
                        <option key={recordIndex} value={recordIndex}>
                          #{recordIndex} ·{" "}
                          {String(record[target.headers[0]] ?? "Record")}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span className="mb-1.5 block text-xs text-muted-foreground">
                    Actual relationship
                  </span>
                  <select
                    className={inputClass}
                    value={pair.isMatch ? "match" : "non-match"}
                    onChange={(event) =>
                      updateGroundTruth(pair.id, {
                        isMatch: event.target.value === "match",
                      })
                    }
                  >
                    <option value="match">Genuine match</option>
                    <option value="non-match">Non-match</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => removeGroundTruth(pair.id)}
                  aria-label={`Remove labelled pair ${index + 1}`}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {!groundTruth.length && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium">No labelled pairs yet</p>
              <p className={`mt-1 ${mutedClass}`}>
                Add at least one source-target pair to evaluate blocking.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 rounded-lg bg-muted/40 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className={mutedClass}>
            Only explicitly labelled pairs are evaluated. Unlabelled candidate
            pairs are not automatically treated as false positives. Use
            representative labels for meaningful candidate precision.
          </p>
        </div>
      </section>

      {/* Run */}
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">Evaluate blocking strategy</p>
          <p className={`mt-1 ${mutedClass}`}>
            Generate candidates and calculate all three evaluation metrics.
          </p>
        </div>

        <Button
          onClick={runEvaluation}
          className="sm:min-w-48"
          disabled={!source.rows.length || !target.rows.length}
        >
          <Play />
          Run evaluation
        </Button>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.section
            key="evaluation-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.22 }}
            className="space-y-7 border-t border-border pt-7"
          >
            <div>
              <p className="text-xs font-medium text-primary">
                04 / EVALUATION RESULTS
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Blocking performance
              </h2>
              <p className={`mt-1 ${mutedClass}`}>
                Results calculated directly from generated candidates and your
                labelled ground truth.
              </p>
            </div>

            {/* Metric cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Candidate Recall"
                value={formatPercent(result.evaluation.metrics.candidateRecall)}
                description="Genuine matches retained"
                icon={Target}
              />

              <MetricCard
                label="Candidate Precision"
                value={formatPercent(
                  result.evaluation.metrics.candidatePrecision,
                )}
                description="Labelled candidates that are matches"
                icon={Check}
              />

              <MetricCard
                label="Reduction Ratio"
                value={formatPercent(result.evaluation.metrics.reductionRatio)}
                description="Possible comparisons eliminated"
                icon={TrendingDown}
              />
            </div>

            {/* Candidate workload */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Candidate generation statistics
              </h3>

              <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className={mutedClass}>Source records</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {formatNumber(result.candidates.stats.totalSourceRecords)}
                  </p>
                </div>

                <div>
                  <p className={mutedClass}>Target records</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {formatNumber(result.candidates.stats.totalTargetRecords)}
                  </p>
                </div>

                <div>
                  <p className={mutedClass}>Possible pairs</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {formatNumber(result.evaluation.totalPossiblePairs)}
                  </p>
                </div>

                <div>
                  <p className={mutedClass}>Candidate pairs</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-primary">
                    {formatNumber(result.evaluation.totalCandidatePairs)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reduction visualization */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  Comparison space reduction
                </h3>
                <span className="text-xs font-semibold text-primary">
                  {formatPercent(result.evaluation.metrics.reductionRatio)}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.evaluation.metrics.reductionRatio * 100}%`,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>

              <div className="mt-3 flex justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {formatNumber(result.evaluation.totalCandidatePairs)} pairs
                  retained
                </span>
                <span>
                  {formatNumber(
                    result.evaluation.totalPossiblePairs -
                      result.evaluation.totalCandidatePairs,
                  )}{" "}
                  eliminated
                </span>
              </div>
            </div>

            {/* Ground truth evaluation counts */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Ground-truth evaluation
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border p-4">
                  <p className={mutedClass}>Labelled pairs</p>
                  <p className="mt-2 text-xl font-semibold tabular-nums">
                    {formatNumber(result.evaluation.totalEvaluatedPairs)}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className={mutedClass}>Labelled candidates</p>
                  <p className="mt-2 text-xl font-semibold tabular-nums">
                    {formatNumber(
                      result.evaluation.totalLabelledCandidatePairs,
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className={mutedClass}>True candidate pairs</p>
                  <p className="mt-2 text-xl font-semibold tabular-nums">
                    {formatNumber(result.evaluation.trueCandidatePairs)}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className={mutedClass}>Total true pairs</p>
                  <p className="mt-2 text-xl font-semibold tabular-nums">
                    {formatNumber(result.evaluation.totalTruePairs)}
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate pairs */}
            <div>
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold">
                    Generated candidate pairs
                  </h3>
                  <p className={`mt-1 ${mutedClass}`}>
                    Inspect which source-target combinations survived blocking.
                  </p>
                </div>

                <span className="w-fit rounded-md bg-muted px-2.5 py-1 text-xs">
                  {result.candidates.pairs.length} candidates
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-3 font-medium">Source</th>
                        <th className="px-3 py-3 font-medium">Target</th>
                        <th className="px-3 py-3 font-medium">Indexes</th>
                        <th className="px-3 py-3 font-medium">Ground truth</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {result.candidates.pairs.map((pair, index) => {
                        const label = groundTruth.find(
                          (item) =>
                            item.sourceIndex === pair.sourceIndex &&
                            item.targetIndex === pair.targetIndex,
                        );

                        return (
                          <tr key={`${pair.sourceIndex}-${pair.targetIndex}`}>
                            <td className="px-3 py-3 text-xs">
                              {String(
                                source.rows[pair.sourceIndex]?.[
                                  source.headers[0]
                                ] ?? "Record",
                              )}
                            </td>
                            <td className="px-3 py-3 text-xs">
                              {String(
                                target.rows[pair.targetIndex]?.[
                                  target.headers[0]
                                ] ?? "Record",
                              )}
                            </td>
                            <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                              {pair.sourceIndex} → {pair.targetIndex}
                            </td>
                            <td className="px-3 py-3">
                              {label ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                    label.isMatch
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {label.isMatch ? (
                                    <>
                                      <Check className="size-3.5" />
                                      Genuine match
                                    </>
                                  ) : (
                                    "Non-match"
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Unlabelled
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {!result.candidates.pairs.length && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-8 text-center text-xs text-muted-foreground"
                          >
                            No candidate pairs were generated.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Labelled pair coverage */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Labelled pair coverage
              </h3>

              <div className="overflow-hidden rounded-lg border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-3 font-medium">Source index</th>
                        <th className="px-3 py-3 font-medium">Target index</th>
                        <th className="px-3 py-3 font-medium">Actual label</th>
                        <th className="px-3 py-3 font-medium">Generated?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {groundTruth.map((pair) => {
                        const generated = candidateSet.has(
                          `${pair.sourceIndex}:${pair.targetIndex}`,
                        );

                        return (
                          <tr key={pair.id}>
                            <td className="px-3 py-3 font-mono text-xs">
                              {pair.sourceIndex}
                            </td>
                            <td className="px-3 py-3 font-mono text-xs">
                              {pair.targetIndex}
                            </td>
                            <td className="px-3 py-3 text-xs">
                              {pair.isMatch ? "Genuine match" : "Non-match"}
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`text-xs font-medium ${
                                  generated
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {generated ? "Yes" : "No"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="rounded-lg bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <Layers3 className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">
                  Interpreting your evaluation
                </h3>
              </div>

              <p className={`mt-2 ${mutedClass}`}>
                Candidate recall tells you how many labelled genuine matches
                survived blocking. Candidate precision describes the labelled
                candidate pairs, not necessarily the complete candidate set.
                Reduction ratio shows how much comparison work was eliminated.
                Use all three metrics together when adjusting your blocking
                rules.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
