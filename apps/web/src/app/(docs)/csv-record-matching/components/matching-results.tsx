"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportMatches } from "@matchforge/core";

import type { FieldMapping, MatchingResult } from "../types";

type Props = {
  result: MatchingResult | null;
  fields: FieldMapping[];
};

export function MatchingResults({ result, fields }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  if (!result) {
    return (
      <section className="mt-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs text-primary">03</span>

            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Matching results
            </h2>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight">
            Matching overview
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Review candidate matches, similarity scores, and field comparisons.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-border px-5 py-14 text-center">
          <FileSpreadsheet className="mx-auto size-8 text-muted-foreground/60" />

          <p className="mt-4 text-sm font-medium">No matching results yet</p>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
            Upload your datasets, configure field mappings, and run matching to
            see the results here.
          </p>
        </div>
      </section>
    );
  }

  const matched = result.matches.filter((item) => item.matched);
  const unmatched = result.matches.filter((item) => !item.matched);

  const visibleResults =
    activeTab === "matched"
      ? matched
      : activeTab === "unmatched"
        ? unmatched
        : result.matches;

  const exportResults = () => {
    const csv = exportMatches(result);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "matchforge-results.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const firstField = fields[0];

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs text-primary">03</span>

            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Matching results
            </h2>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight">
            Matching overview
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Review weighted scores and individual field comparisons.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={exportResults}>
          <Download />
          Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Source records</p>

          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {result.totalSourceRecords}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Matched records</p>

          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-primary">
            {matched.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Unmatched records</p>

          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {unmatched.length}
          </p>
        </div>
      </div>

      {/* Results tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All records", count: result.matches.length },
          { value: "matched", label: "Matched", count: matched.length },
          { value: "unmatched", label: "Unmatched", count: unmatched.length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setExpandedIndex(null);
            }}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="ml-1 opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Result table */}
      <div className="overflow-x-auto border-y border-border">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)_90px_100px_110px] gap-3 py-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Source record</span>
            <span>Best candidate</span>
            <span className="text-right">Similarity</span>
            <span className="text-right">Status</span>
            <span className="text-right">Returned</span>
          </div>

          {visibleResults.length > 0 ? (
            visibleResults.map((item) => {
              const index = result.matches.indexOf(item);
              const bestCandidate = item.candidates[0];
              const expanded = expandedIndex === index;

              return (
                <div
                  key={item.sourceRecordNumber}
                  className="border-t border-border/80"
                >
                  <div className="grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)_90px_100px_110px] items-center gap-3 py-4 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {firstField
                          ? item.source[firstField.sourceKey] || "—"
                          : `Record ${item.sourceRecordNumber}`}
                      </p>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Record #{item.sourceRecordNumber}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-muted-foreground">
                        {bestCandidate && firstField
                          ? bestCandidate.record[firstField.targetKey] || "—"
                          : "No candidate returned"}
                      </p>

                      {bestCandidate && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Target #{bestCandidate.targetRecordNumber}
                        </p>
                      )}
                    </div>

                    <span className="text-right font-mono text-xs tabular-nums">
                      {bestCandidate
                        ? `${(bestCandidate.score * 100).toFixed(2)}%`
                        : "—"}
                    </span>

                    <span className="text-right">
                      {item.matched ? (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="size-3" />
                          Matched
                        </Badge>
                      ) : (
                        <Badge variant="outline">Unmatched</Badge>
                      )}
                    </span>

                    <div className="flex items-center justify-end gap-2">
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {item.candidates.length}
                      </span>

                      {item.candidates.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleExpanded(index)}
                          title="View candidates"
                        >
                          {expanded ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {expanded && (
                    <div className="mb-4 rounded-lg bg-muted/30 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Ranked candidates
                        </p>

                        <span className="text-xs text-muted-foreground">
                          {item.candidates.length} returned
                        </span>
                      </div>

                      <div className="space-y-4">
                        {item.candidates.map((candidate, candidateIndex) => (
                          <div
                            key={candidate.targetRecordNumber}
                            className="rounded-lg border border-border bg-card p-4"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                              <div className="flex items-start gap-3">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-semibold text-primary">
                                  {candidateIndex + 1}
                                </span>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {firstField
                                      ? candidate.record[
                                          firstField.targetKey
                                        ] || "—"
                                      : `Record ${candidate.targetRecordNumber}`}
                                  </p>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Target record #
                                    {candidate.targetRecordNumber}
                                  </p>
                                </div>
                              </div>

                              <div className="sm:text-right">
                                <p className="font-mono text-lg font-semibold tabular-nums text-primary">
                                  {(candidate.score * 100).toFixed(2)}%
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                  {candidate.method} · Similarity
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-3 border-t border-border pt-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Field comparisons
                              </p>

                              {candidate.fieldScores.map(
                                (score, fieldIndex) => (
                                  <div
                                    key={`${score.sourceKey}-${score.targetKey}-${fieldIndex}`}
                                    className="grid gap-2 sm:grid-cols-[1fr_1fr_75px_70px] sm:items-center"
                                  >
                                    <span className="truncate text-xs">
                                      {score.sourceKey}
                                    </span>

                                    <span className="truncate text-xs text-muted-foreground">
                                      {score.targetKey}
                                    </span>

                                    <span className="font-mono text-xs tabular-nums">
                                      {(score.score * 100).toFixed(2)}%
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(score.weight * 100)}% weight
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="border-t border-border py-12 text-center text-sm text-muted-foreground">
              No records in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
