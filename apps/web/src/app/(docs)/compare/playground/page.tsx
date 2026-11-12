"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  compareStrings,
  levenshteinDistance,
  damerauLevenshteinDistance,
  soundex,
  metaphone,
  type SimilarityMethod,
} from "@matchforge/core";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const algorithms: {
  value: SimilarityMethod;
  label: string;
  category: string;
}[] = [
  { value: "levenshtein", label: "Levenshtein", category: "Edit distance" },
  {
    value: "damerau-levenshtein",
    label: "Damerau-Levenshtein",
    category: "Edit distance",
  },
  { value: "jaro", label: "Jaro", category: "Character matching" },
  {
    value: "jaro-winkler",
    label: "Jaro-Winkler",
    category: "Character matching",
  },
  { value: "jaccard", label: "Jaccard", category: "Q-gram" },
  { value: "dice", label: "Dice", category: "Q-gram" },
  { value: "cosine", label: "Cosine", category: "Q-gram" },
  { value: "soundex", label: "Soundex", category: "Phonetic" },
  { value: "metaphone", label: "Metaphone", category: "Phonetic" },
];

type ComparisonResult = {
  method: SimilarityMethod;
  score: number;
  distance?: number;
  codeA?: string;
  codeB?: string;
};

const initialA = "Jonathan";
const initialB = "Jonathon";

export default function ComparePage() {
  const [stringA, setStringA] = useState(initialA);
  const [stringB, setStringB] = useState(initialB);
  const [method, setMethod] = useState("all");
  const [q, setQ] = useState("2");

  const selectedMethods: SimilarityMethod[] =
    method === "all"
      ? algorithms.map((item) => item.value)
      : [method as SimilarityMethod];

  const results = useMemo(() => {
    if (!stringA || !stringB) return [];

    return selectedMethods
      .map((currentMethod): ComparisonResult => {
        const score = compareStrings(stringA, stringB, {
          method: currentMethod,
          algorithmOptions: { q: Number(q) },
        });

        if (currentMethod === "levenshtein") {
          return {
            method: currentMethod,
            score,
            distance: levenshteinDistance(stringA, stringB),
          };
        }

        if (currentMethod === "damerau-levenshtein") {
          return {
            method: currentMethod,
            score,
            distance: damerauLevenshteinDistance(stringA, stringB),
          };
        }

        if (currentMethod === "soundex") {
          return {
            method: currentMethod,
            score,
            codeA: soundex(stringA),
            codeB: soundex(stringB),
          };
        }

        if (currentMethod === "metaphone") {
          return {
            method: currentMethod,
            score,
            codeA: metaphone(stringA),
            codeB: metaphone(stringB),
          };
        }

        return { method: currentMethod, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [stringA, stringB, selectedMethods.join(","), q]);

  const bestResult = results[0];

  const showQSelector =
    method === "all" ||
    method === "jaccard" ||
    method === "dice" ||
    method === "cosine";

  const getLabel = (value: SimilarityMethod) =>
    algorithms.find((item) => item.value === value)?.label ?? value;

  const getCategory = (value: SimilarityMethod) =>
    algorithms.find((item) => item.value === value)?.category ?? "";

  const swapStrings = () => {
    setStringA(stringB);
    setStringB(stringA);
  };

  const reset = () => {
    setStringA(initialA);
    setStringB(initialB);
    setMethod("all");
    setQ("2");
  };

  const hasInputs = stringA.length > 0 && stringB.length > 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-7">
      <Link
        href="/compare"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Compare Docs
      </Link>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            String comparison Playground
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Put two strings head to head. Discover how different algorithms //
            interpret their similarity.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset
        </Button>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">01</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Input strings
            </h2>
          </div>

          <span className="text-xs text-muted-foreground">
            {stringA.length + stringB.length} characters total
          </span>
        </div>

        <div className="relative grid gap-3 md:grid-cols-2">
          <div className="group relative min-w-0 border-b border-border bg-card/60 p-5 transition-colors hover:bg-card sm:p-7 md:border md:rounded-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold">First string</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Source text
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                {stringA.length} chars
              </span>
            </div>

            <Textarea
              value={stringA}
              onChange={(event) => setStringA(event.target.value)}
              placeholder="Enter first string..."
              aria-label="First string"
              className="min-h-28 resize-y text-xl font-medium leading-relaxed focus-visible:ring-0 sm:text-2xl"
            />

            <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Input A
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {stringA.length} / characters
              </span>
            </div>
          </div>

          <div className="group relative min-w-0 border-b border-border bg-card/60 p-5 transition-colors hover:bg-card sm:p-7 md:rounded-xl md:border">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-secondary font-mono text-sm font-semibold">
                  B
                </span>
                <div>
                  <p className="text-sm font-semibold">Second string</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Comparison text
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                {stringB.length} chars
              </span>
            </div>

            <Textarea
              value={stringB}
              onChange={(event) => setStringB(event.target.value)}
              placeholder="Enter second string..."
              aria-label="Second string"
              className="min-h-28 resize-y text-xl font-medium leading-relaxed focus-visible:ring-0 sm:text-2xl"
            />

            <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Input B
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {stringB.length} characters
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={swapStrings}
            aria-label="Swap strings"
            title="Swap strings"
            className="absolute left-1/2 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
          >
            <ArrowLeftRight className="size-4 transition-transform duration-300 hover:rotate-180" />
          </button>
        </div>
      </section>

      <section className="mt-10 border-y border-border py-5">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary">02</span>
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Algorithm configuration
              </h2>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Choose which methods to run against your strings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <Select
                value={method}
                onValueChange={(value) => {
                  if (value !== null) setMethod(value);
                }}
              >
                <SelectTrigger className="h-10 w-full bg-card">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All algorithms</SelectItem>
                  {algorithms.map((algorithm) => (
                    <SelectItem key={algorithm.value} value={algorithm.value}>
                      {algorithm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showQSelector && (
              <div className="w-28">
                <Select
                  value={q}
                  onValueChange={(value) => {
                    if (value !== null) setQ(value);
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-card">
                    <SelectValue placeholder="Q size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value}-gram
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-xs text-primary">03</span>
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Comparison results
              </h2>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight">
              Algorithm ranking
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {results.length}{" "}
              {results.length === 1 ? "algorithm" : "algorithms"} ranked by
              similarity.
            </p>
          </div>

          {results.length > 0 && (
            <Badge variant="outline" className="hidden sm:flex">
              Highest score first
            </Badge>
          )}
        </div>

        {!hasInputs ? (
          <div className="flex flex-col items-center justify-center border-y border-border py-16 text-center">
            <Sparkles className="size-7 text-muted-foreground" />
            <p className="mt-4 font-medium">Waiting for both strings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter two strings to calculate their similarity.
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {bestResult && (
                <motion.div
                  key={`${bestResult.method}-${bestResult.score}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="relative mb-9 overflow-hidden rounded-xl border border-primary/20 bg-accent p-6 text-accent-foreground sm:p-8"
                >
                  <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border border-primary/10" />
                  <div className="pointer-events-none absolute -right-2 -top-12 size-48 rounded-full border border-primary/10" />

                  <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-primary">
                        <Trophy className="size-4" />
                        Best matching algorithm
                      </div>

                      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {getLabel(bestResult.method)}
                      </h3>

                      <p className="mt-2 text-sm text-accent-foreground/70">
                        {getCategory(bestResult.method)}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs text-accent-foreground">
                        <Check className="size-3.5 text-primary" />
                        Highest score among {results.length}{" "}
                        {results.length === 1 ? "method" : "methods"}
                      </div>
                    </div>

                    <div className="relative sm:text-right">
                      <p className="font-mono text-5xl font-semibold tracking-tighter text-primary sm:text-6xl">
                        {(bestResult.score * 100).toFixed(2)}
                        <span className="ml-1 text-2xl">%</span>
                      </p>
                      <p className="mt-2 text-xs text-accent-foreground/65">
                        Similarity score
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-7 h-1.5 overflow-hidden rounded-full bg-primary/10">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max(
                          0,
                          Math.min(100, bestResult.score * 100),
                        )}%`,
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <div className="hidden grid-cols-[48px_1fr_110px_150px] gap-4 border-b border-border pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:grid">
                <span>Rank</span>
                <span>Algorithm</span>
                <span className="text-right">Score</span>
                <span className="text-right">Similarity</span>
              </div>

              <AnimatePresence mode="popLayout">
                {results.map((result, index) => {
                  const percentage = result.score * 100;
                  const isBest = index === 0;

                  return (
                    <motion.div
                      key={result.method}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.22,
                        delay: index * 0.025,
                      }}
                      className="group grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-border/80 py-5 transition-colors hover:bg-muted/30 sm:grid-cols-[48px_1fr_110px_150px] sm:gap-4 sm:px-2"
                    >
                      <span
                        className={`font-mono text-xs ${
                          isBest ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">
                            {getLabel(result.method)}
                          </span>

                          {isBest && (
                            <Badge
                              variant="secondary"
                              className="h-5 gap-1 text-[10px]"
                            >
                              <Check className="size-3" />
                              Best
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {getCategory(result.method)}
                        </p>

                        {result.distance !== undefined && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Edit distance:{" "}
                            <span className="font-mono text-foreground">
                              {result.distance}
                            </span>
                          </p>
                        )}

                        {result.codeA !== undefined && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>
                              A:{" "}
                              <span className="font-mono text-foreground">
                                {result.codeA || "—"}
                              </span>
                            </span>
                            <span>
                              B:{" "}
                              <span className="font-mono text-foreground">
                                {result.codeB || "—"}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-right font-mono text-sm font-semibold tabular-nums ${
                          isBest ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {percentage.toFixed(2)}%
                      </span>

                      <div className="hidden sm:block">
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={`h-full rounded-full ${
                              isBest ? "bg-primary" : "bg-muted-foreground/40"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.max(
                                0,
                                Math.min(100, percentage),
                              )}%`,
                            }}
                            transition={{
                              duration: 0.6,
                              delay: index * 0.025,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
