"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { FieldMapping, MatchingResult, RecordMatch } from "../types";

type MatchingResultsProps = {
  result: MatchingResult | null;
  fields: FieldMapping[];
};

export function MatchingResults({ result, fields }: MatchingResultsProps) {
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
            Record overview
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Review weighted scores and individual field comparisons.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-border px-5 py-14 text-center">
          <FileSpreadsheet className="mx-auto size-8 text-muted-foreground/60" />
          <p className="mt-4 text-sm font-medium">No matching results yet</p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
            Edit the demo records, configure the fields you want to compare, and
            run matching to see the results here.
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
    const headers = [
      "Source record",
      "Candidate rank",
      "Candidate",
      "Similarity",
      "Status",
      "Candidates returned",
      ...fields.map(
        (field) => `${field.sourceKey} → ${field.targetKey} similarity`,
      ),
    ];

    const rows = result.matches.flatMap((item) => {
      const candidates = item.candidates;

      if (!candidates.length) {
        return [
          [
            item.source[fields[0]?.sourceKey] ?? "",
            "",
            "",
            "",
            "Unmatched",
            0,
            ...fields.map(() => ""),
          ],
        ];
      }

      return candidates.map((candidate, index) => {
        const fieldValues = fields.map((field) => {
          const score = candidate.fieldScores.find(
            (item) =>
              item.sourceKey === field.sourceKey &&
              item.targetKey === field.targetKey,
          );

          return score ? `${(score.score * 100).toFixed(2)}%` : "";
        });

        return [
          item.source[fields[0]?.sourceKey] ?? "",
          index + 1,
          candidate.record[fields[0]?.targetKey] ?? "",
          `${(candidate.score * 100).toFixed(2)}%`,
          item.matched ? "Matched" : "Below threshold",
          candidates.length,
          ...fieldValues,
        ];
      });
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const renderRecord = (item: RecordMatch, index: number) => {
    const bestCandidate = item.candidates[0];
    const expanded = expandedIndex === index;

    return (
      <div key={index} className="border-t border-border/80">
        <div className="grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)_90px_100px_110px] items-center gap-3 py-4 text-sm">
          <span className="min-w-0 truncate font-medium">
            {item.source[fields[0]?.sourceKey] || "—"}
          </span>

          <span className="min-w-0 truncate text-muted-foreground">
            {bestCandidate
              ? bestCandidate.record[fields[0]?.targetKey] || "—"
              : "No candidate returned"}
          </span>

          <span className="text-right font-mono text-xs tabular-nums">
            {bestCandidate ? `${(bestCandidate.score * 100).toFixed(2)}%` : "—"}
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
              {item.candidates.length}{" "}
              {item.candidates.length === 1 ? "candidate" : "candidates"}
            </span>

            {item.candidates.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toggleExpanded(index)}
                title="View all candidates"
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
                  key={candidateIndex}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-semibold text-primary">
                        {candidateIndex + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {candidate.record[fields[0]?.targetKey] || "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {candidateIndex === 0
                            ? "Highest-ranked candidate"
                            : `Rank ${candidateIndex + 1}`}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-mono text-lg font-semibold tabular-nums text-primary">
                        {(candidate.score * 100).toFixed(2)}%
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Similarity
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-border pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Field comparisons
                    </p>

                    {candidate.fieldScores.map((score, fieldIndex) => (
                      <div
                        key={`${score.sourceKey}-${score.targetKey}-${fieldIndex}`}
                        className="grid gap-2 sm:grid-cols-[1fr_1fr_75px_60px] sm:items-center"
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
            Record overview
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Review weighted scores and individual field comparisons.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={exportResults}>
          <FileSpreadsheet />
          Export CSV
        </Button>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border-l-2 border-primary py-2 pl-4">
          <p className="text-xs text-muted-foreground">Source records</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {result.totalSourceRecords}
          </p>
        </div>

        <div className="border-l-2 border-primary py-2 pl-4">
          <p className="text-xs text-muted-foreground">Matched</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-primary">
            {matched.length}
          </p>
        </div>

        <div className="col-span-2 border-l-2 border-border py-2 pl-4 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Unmatched</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {unmatched.length}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { value: "all", label: "All records", count: result.matches.length },
          { value: "matched", label: "Matched", count: matched.length },
          { value: "unmatched", label: "Unmatched", count: unmatched.length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
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
            visibleResults.map((item, index) => renderRecord(item, index))
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
