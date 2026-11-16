"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Play,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  generateCandidates,
  matchRecords,
  type BlockingMethod,
  type BlockingRule,
  type CandidateGenerationResult,
  type NormalizeOptions,
  type SimilarityMethod,
} from "@matchforge/core";

import { Button } from "@/components/ui/button";

import { DatasetPanel } from "../../record-matching/components/dataset-panel";
import { MatchingResults } from "../../record-matching/components/matching-results";

import {
  demoSource,
  demoTarget,
  initialMappings,
} from "../../../../data/record-matching";

import type {
  Dataset,
  FieldMapping,
  MatchingResult,
} from "../../record-matching/types";

type RuleItem = BlockingRule & {
  id: number;
};

type ComparisonResults = {
  withoutBlocking: MatchingResult;
  withBlocking: MatchingResult;
  candidates: CandidateGenerationResult;
};

const initialNormalization: NormalizeOptions = {
  lowercase: true,
  trim: true,
  normalizeWhitespace: true,
  removePunctuation: false,
  removeAccents: false,
};

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

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const mutedClass = "text-xs leading-5 text-muted-foreground";

function Metric({
  label,
  value,
  description,
  highlight = false,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
      <p className={`mt-1 ${mutedClass}`}>{description}</p>
    </div>
  );
}

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

function createInitialRules(source: Dataset, target: Dataset): RuleItem[] {
  const sourceName =
    source.headers.find((header) =>
      ["customer_name", "name", "full_name"].includes(header.toLowerCase()),
    ) ?? source.headers[0];

  const targetName =
    target.headers.find((header) =>
      ["full_name", "name", "customer_name"].includes(header.toLowerCase()),
    ) ?? target.headers[0];

  const sourceLocation = source.headers.find((header) =>
    ["city", "location", "address"].includes(header.toLowerCase()),
  );

  const targetLocation = target.headers.find((header) =>
    ["location", "city", "address"].includes(header.toLowerCase()),
  );

  const rules: RuleItem[] = [];

  if (sourceName && targetName) {
    rules.push({
      id: 1,
      sourceKey: sourceName,
      targetKey: targetName,
      method: "prefix",
      length: 3,
    });
  }

  if (sourceLocation && targetLocation) {
    rules.push({
      id: 2,
      sourceKey: sourceLocation,
      targetKey: targetLocation,
      method: "exact",
    });
  }

  return rules;
}

export default function BlockingPlaygroundPage() {
  const [source, setSource] = useState<Dataset>(demoSource);
  const [target, setTarget] = useState<Dataset>(demoTarget);

  const [fields, setFields] = useState<FieldMapping[]>(initialMappings);

  const [rules, setRules] = useState<RuleItem[]>(() =>
    createInitialRules(demoSource, demoTarget),
  );

  const [method, setMethod] = useState<SimilarityMethod>("jaro-winkler");

  const [threshold, setThreshold] = useState(0.8);

  const [normalization, setNormalization] =
    useState<NormalizeOptions>(initialNormalization);

  const [comparison, setComparison] = useState<ComparisonResults | null>(null);

  const [activeApproach, setActiveApproach] = useState<"blocked" | "unblocked">(
    "blocked",
  );

  const [error, setError] = useState("");

  const invalidateResults = () => {
    setComparison(null);
    setError("");
  };

  const updateSource = (dataset: Dataset) => {
    setSource(dataset);

    setRules((current) =>
      current.map((rule, index) => ({
        ...rule,
        sourceKey:
          dataset.headers[index % Math.max(dataset.headers.length, 1)] ?? "",
      })),
    );

    invalidateResults();
  };

  const updateTarget = (dataset: Dataset) => {
    setTarget(dataset);

    setRules((current) =>
      current.map((rule, index) => ({
        ...rule,
        targetKey:
          dataset.headers[index % Math.max(dataset.headers.length, 1)] ?? "",
      })),
    );

    invalidateResults();
  };

  const updateField = (id: number, updates: Partial<FieldMapping>) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    );

    invalidateResults();
  };

  const addField = () => {
    if (!source.headers.length || !target.headers.length) return;

    setFields((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((field) => field.id)) + 1,
        sourceKey: source.headers[0],
        targetKey: target.headers[0],
        weight: 0.2,
      },
    ]);

    invalidateResults();
  };

  const removeField = (id: number) => {
    setFields((current) => current.filter((field) => field.id !== id));

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

  const reset = () => {
    setSource(demoSource);
    setTarget(demoTarget);
    setFields(initialMappings);
    setRules(createInitialRules(demoSource, demoTarget));
    setMethod("jaro-winkler");
    setThreshold(0.8);
    setNormalization(initialNormalization);
    setComparison(null);
    setActiveApproach("blocked");
    setError("");
  };

  const runComparison = () => {
    setError("");
    setComparison(null);

    if (!source.rows.length || !target.rows.length) {
      setError("Both datasets must contain at least one record.");
      return;
    }

    if (!fields.length || !fields.some((field) => field.weight > 0)) {
      setError("Add at least one matching field with a positive weight.");
      return;
    }

    const invalidField = fields.some(
      (field) =>
        !source.headers.includes(field.sourceKey) ||
        !target.headers.includes(field.targetKey) ||
        !Number.isFinite(field.weight) ||
        field.weight < 0,
    );

    if (invalidField) {
      setError("Check your matching field mappings and weights.");
      return;
    }

    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
      setError("Similarity threshold must be between 0 and 1.");
      return;
    }

    if (!rules.length) {
      setError("Add at least one blocking rule.");
      return;
    }

    const invalidRule = rules.some(
      (rule) =>
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

    try {
      const blockingRules = rules.map(({ id, ...rule }) => rule);

      const commonOptions = {
        fields: fields.map(({ sourceKey, targetKey, weight }) => ({
          sourceKey,
          targetKey,
          weight,
        })),
        method,
        threshold,
        normalization,
      };

      // Baseline: score every possible source-target pair.
      const withoutBlocking = matchRecords(
        source.rows,
        target.rows,
        commonOptions,
      );

      // Generate candidates to measure the reduction.
      const candidates = generateCandidates(source.rows, target.rows, {
        rules: blockingRules,
        normalization,
      });

      // Blocked approach: score only generated candidate pairs.
      const withBlocking = matchRecords(source.rows, target.rows, {
        ...commonOptions,
        blocking: {
          rules: blockingRules,
          normalization,
        },
      });

      setComparison({
        withoutBlocking,
        withBlocking,
        candidates,
      });

      setActiveApproach("blocked");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to run the comparison.",
      );
    }
  };

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const candidateStats = comparison?.candidates.stats;

  const activeResult =
    comparison === null
      ? null
      : activeApproach === "blocked"
        ? comparison.withBlocking
        : comparison.withoutBlocking;

  const unblockedMatches =
    comparison?.withoutBlocking.matches.filter((item) => item.matched).length ??
    0;

  const blockedMatches =
    comparison?.withBlocking.matches.filter((item) => item.matched).length ?? 0;

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

  return (
    <main className="mx-auto max-w-6xl space-y-8 overflow-x-hidden px-5 py-8 sm:px-7">
      {/* Header */}
      <header>
        <Link
          href="/blocking"
          className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Blocking documentation
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-primary">
              MATCHFORGE PLAYGROUND
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Blocking comparison
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Compare record matching before and after blocking. See how
              candidate generation reduces comparisons and how it affects the
              matching results.
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

      {/* Core idea */}
      <section className="rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div>
            <p className="text-xs text-muted-foreground">INPUT</p>
            <p className="mt-1 text-sm font-semibold">Two datasets</p>
            <p className={mutedClass}>Source and target records</p>
          </div>

          <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />

          <div>
            <p className="text-xs text-muted-foreground">
              CANDIDATE GENERATION
            </p>
            <p className="mt-1 text-sm font-semibold">Blocking</p>
            <p className={mutedClass}>Reduce possible pairs</p>
          </div>

          <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />

          <div>
            <p className="text-xs text-muted-foreground">FINAL STEP</p>
            <p className="mt-1 text-sm font-semibold">Similarity matching</p>
            <p className={mutedClass}>Score and rank candidates</p>
          </div>
        </div>
      </section>

      {/* Datasets */}
      <section>
        <SectionHeading
          number="01"
          title="Input datasets"
          description="Both approaches use the same source and target records."
        />

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <DatasetPanel label="A" dataset={source} onChange={updateSource} />

          <DatasetPanel label="B" dataset={target} onChange={updateTarget} />
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Matching configuration */}
      <section>
        <SectionHeading
          number="02"
          title="Matching configuration"
          description="These settings remain identical in both approaches."
        />

        <div className="space-y-3">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-medium">Field mappings</h3>
              <p className={mutedClass}>
                Choose which fields contribute to the similarity score.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addField}
              disabled={!source.headers.length || !target.headers.length}
            >
              <Plus />
              Add field
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid min-w-0 gap-3 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_32px] sm:items-end"
            >
              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Source field
                </span>

                <select
                  className={inputClass}
                  value={field.sourceKey}
                  onChange={(event) =>
                    updateField(field.id, {
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
                  value={field.targetKey}
                  onChange={(event) =>
                    updateField(field.id, {
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
                <span className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  Weight
                  <span className="font-mono text-primary">
                    {(field.weight * 100).toFixed(0)}%
                  </span>
                </span>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={field.weight}
                  onChange={(event) =>
                    updateField(field.id, {
                      weight: Number(event.target.value),
                    })
                  }
                  className="h-9 w-full cursor-pointer accent-primary"
                />
              </label>

              <button
                type="button"
                onClick={() => removeField(field.id)}
                aria-label={`Remove field mapping ${index + 1}`}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          {!fields.length && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium">No field mappings</p>
              <p className={`mt-1 ${mutedClass}`}>
                Add a field to calculate similarity scores.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 border-t border-border pt-5 sm:grid-cols-2">
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

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Minimum similarity threshold
              </label>

              <span className="font-mono text-sm font-semibold text-primary">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>

            <input
              type="range"
              min={0.1}
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
              <span>10% · More matches</span>
              <span>100% · Stricter</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Blocking configuration */}
      <section>
        <SectionHeading
          number="03"
          title="Blocking rules"
          description="These rules are applied only to the blocked approach."
        />

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="grid min-w-0 gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_130px_100px_36px] xl:items-end"
            >
              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  Source field
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
                  Method
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

              <label>
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  {rule.method === "prefix" ? "Prefix length" : "Settings"}
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
                  />
                ) : (
                  <div className="flex h-9 items-center text-xs text-muted-foreground">
                    Default
                  </div>
                )}
              </label>

              <button
                type="button"
                onClick={() => removeRule(rule.id)}
                aria-label={`Remove blocking rule ${index + 1}`}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addRule}
            disabled={!source.headers.length || !target.headers.length}
          >
            <Plus />
            Add blocking rule
          </Button>
        </div>

        <div className="mt-4 flex gap-2 rounded-lg bg-muted/40 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className={mutedClass}>
            <strong className="font-medium text-foreground">OR logic:</strong> A
            pair is retained if it satisfies at least one rule. Duplicate
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
            <span className="text-xs text-muted-foreground group-open:rotate-180">
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

      {/* Run */}
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">Ready to compare?</p>
          <p className={`mt-1 ${mutedClass}`}>
            Run both approaches using the same datasets and matching settings.
          </p>
        </div>

        <Button
          onClick={runComparison}
          className="sm:min-w-52"
          disabled={!source.rows.length || !target.rows.length}
        >
          <Play />
          Run comparison
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
      {comparison && candidateStats && (
        <section className="space-y-7 border-t border-border pt-7">
          <div>
            <p className="text-xs font-medium text-primary">04 / RESULTS</p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Before vs. after blocking
            </h2>

            <p className={`mt-1 ${mutedClass}`}>
              See the reduction in comparison workload and inspect the resulting
              matches.
            </p>
          </div>

          {/* Main comparison */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Without blocking</p>
                <span className="rounded-md bg-muted px-2 py-1 text-[10px]">
                  Baseline
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tabular-nums">
                {formatNumber(candidateStats.totalPossiblePairs)}
              </p>

              <p className={`mt-1 ${mutedClass}`}>Total pairs to compare</p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-2xl font-semibold tabular-nums">
                  {unblockedMatches}
                </p>
                <p className={mutedClass}>Source records matched</p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/40 bg-primary/[0.03] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">With blocking</p>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] text-primary">
                  Reduced candidates
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tabular-nums text-primary">
                {formatNumber(candidateStats.candidatePairs)}
              </p>

              <p className={`mt-1 ${mutedClass}`}>Candidate pairs to compare</p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-2xl font-semibold tabular-nums">
                  {blockedMatches}
                </p>
                <p className={mutedClass}>Source records matched</p>
              </div>
            </div>
          </div>

          {/* Reduction metrics */}
          <div className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-3 sm:gap-0">
            <Metric
              label="Possible pairs"
              value={formatNumber(candidateStats.totalPossiblePairs)}
              description="Before blocking"
            />

            <Metric
              label="Candidate pairs"
              value={formatNumber(candidateStats.candidatePairs)}
              description="After blocking"
              highlight
            />

            <Metric
              label="Pair reduction"
              value={`${candidateStats.reductionPercentage.toFixed(2)}%`}
              description="Comparisons eliminated"
              highlight
            />
          </div>

          {/* Visual comparison bar */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Comparison workload</h3>

              <span className="text-xs text-muted-foreground">
                Relative number of pairs
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span>Without blocking</span>
                  <span className="font-mono">
                    {formatNumber(candidateStats.totalPossiblePairs)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-muted-foreground/60" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span>With blocking</span>
                  <span className="font-mono text-primary">
                    {formatNumber(candidateStats.candidatePairs)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${
                        candidateStats.totalPossiblePairs === 0
                          ? 0
                          : Math.min(
                              100,
                              (candidateStats.candidatePairs /
                                candidateStats.totalPossiblePairs) *
                                100,
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Result switcher */}
          <div>
            <h3 className="text-sm font-semibold">Inspect matching results</h3>

            <p className={`mt-1 ${mutedClass}`}>
              Switch between the two approaches to inspect their individual
              record matches and similarity scores.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveApproach("unblocked")}
                className={`rounded-lg border p-4 text-left transition ${
                  activeApproach === "unblocked"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <p className="text-xs text-muted-foreground">
                  Without blocking
                </p>

                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {unblockedMatches}
                </p>

                <p className={mutedClass}>Matched source records</p>

                <p className="mt-3 text-xs text-muted-foreground">
                  All possible pairs considered
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveApproach("blocked")}
                className={`rounded-lg border p-4 text-left transition ${
                  activeApproach === "blocked"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <p className="text-xs text-muted-foreground">With blocking</p>

                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {blockedMatches}
                </p>

                <p className={mutedClass}>Matched source records</p>

                <p className="mt-3 text-xs text-muted-foreground">
                  Only generated candidates considered
                </p>
              </button>
            </div>
          </div>

          {/* Detailed results */}
          {activeResult && (
            <div className="border-t border-border pt-6">
              <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold">
                    {activeApproach === "blocked"
                      ? "Results with blocking"
                      : "Results without blocking"}
                  </h3>

                  <p className={`mt-1 ${mutedClass}`}>
                    {activeApproach === "blocked"
                      ? "Only generated candidate pairs were scored."
                      : "Every source-target pair was considered."}
                  </p>
                </div>

                <span className="w-fit rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                  {activeApproach === "blocked"
                    ? "Blocking enabled"
                    : "Blocking disabled"}
                </span>
              </div>

              <MatchingResults result={activeResult} fields={fields} />
            </div>
          )}

          {/* Interpretation */}
          <div className="rounded-lg bg-muted/40 p-4">
            <h3 className="text-sm font-semibold">What should you observe?</h3>

            <ul className={`mt-2 list-disc space-y-1 pl-5 ${mutedClass}`}>
              <li>
                Without blocking, every source record is compared against every
                target record.
              </li>
              <li>
                Blocking reduces the number of candidate pairs that need
                similarity scoring.
              </li>
              <li>
                Blocking may also remove genuine matches if the selected rules
                are too restrictive.
              </li>
              <li>
                A higher reduction is not automatically better. Compare the
                matching outcomes as well.
              </li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
