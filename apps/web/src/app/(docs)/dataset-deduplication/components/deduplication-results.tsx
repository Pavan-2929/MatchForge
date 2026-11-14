"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CopyCheck,
  Search,
  Users,
} from "lucide-react";

import type {
  DataRecord,
  DeduplicationField,
  DeduplicationResult,
} from "../types";

import { Download } from "lucide-react";
import { exportUniqueCSV } from "@matchforge/core";
import type { UniqueCSVExportOptions } from "@matchforge/core";

type Props = {
  result: DeduplicationResult | null;
  fields: DeduplicationField[];
  records: DataRecord[];
  headers: string[];
};

type Tab = "groups" | "unique";
type GroupSort = "similarity" | "size";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function getRecordLabel(record: DataRecord, fields: DeduplicationField[]) {
  const key = fields[0]?.key;
  return key ? record[key] || "Unnamed record" : "Record";
}

function getBestScore(group: DeduplicationResult["duplicateGroups"][number]) {
  return group.duplicatePairs.reduce(
    (best, pair) => Math.max(best, pair.score),
    0,
  );
}

function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col justify-between gap-3 border-t border-border py-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Showing {start}–{end} of {totalItems}
        </p>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-8 rounded-md border border-border bg-card px-2 text-xs outline-none focus:border-primary"
          aria-label="Items per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="min-w-20 text-center text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function DeduplicationResults({
  result,
  fields,
  records,
  headers,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("groups");
  const [search, setSearch] = useState("");
  const [groupSort, setGroupSort] = useState<GroupSort>("similarity");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [exportMode, setExportMode] =
    useState<NonNullable<UniqueCSVExportOptions["keep"]>>("most-complete");

  const filteredGroups = useMemo(() => {
    if (!result) return [];

    const query = search.trim().toLowerCase();

    const groups = result.duplicateGroups.filter((group) => {
      if (!query) return true;

      const searchableText = [
        `group ${group.groupId}`,
        ...group.records.flatMap((record) =>
          Object.entries(record).flatMap(([key, value]) => [key, value]),
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    return [...groups].sort((a, b) => {
      if (groupSort === "size") {
        return b.records.length - a.records.length;
      }

      return getBestScore(b) - getBestScore(a);
    });
  }, [result, search, groupSort]);

  const filteredUniqueRecords = useMemo(() => {
    if (!result) return [];

    const query = search.trim().toLowerCase();

    if (!query) return result.uniqueRecords;

    return result.uniqueRecords.filter((record) => {
      const searchableText = Object.entries(record)
        .flatMap(([key, value]) => [key, value])
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [result, search]);

  const currentItems =
    activeTab === "groups" ? filteredGroups : filteredUniqueRecords;

  const totalItems = currentItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleItems = currentItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (!result) {
    return null;
  }

  const duplicatePercentage =
    result.totalRecords > 0
      ? (result.duplicateRecordsCount / result.totalRecords) * 100
      : 0;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearch("");
    setPage(1);
    setExpandedGroup(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setExpandedGroup(null);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleExport = () => {
    if (!result) return;

    const csv = exportUniqueCSV(
      {
        ...result,
        records,
        headers,
        parseErrors: [],
      },
      {
        keep: exportMode,
      },
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "matchforge-deduplicated.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-12">
      {/* Heading */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-xs text-primary">03</span>

          <h2 className="text-xs font-semibold uppercase tracking-wider">
            Deduplication results
          </h2>
        </div>

        <h3 className="text-2xl font-semibold tracking-tight">
          Results explorer
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Explore duplicate groups, inspect record comparisons, and review
          unique records.
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total records</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {result.totalRecords.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Duplicate groups</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-primary">
              {result.duplicateGroupsCount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Duplicate records</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {result.duplicateRecordsCount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Unique records</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {result.uniqueRecordsCount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Record distribution</span>

            <span className="font-mono tabular-nums">
              {duplicatePercentage.toFixed(1)}% duplicates
            </span>
          </div>

          <div
            className="flex h-2 overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${duplicatePercentage.toFixed(1)} percent duplicate records`}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
              style={{
                width: `${Math.min(100, duplicatePercentage)}%`,
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              Duplicate records
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-muted-foreground/40" />
              Unique records
            </span>
          </div>
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Export cleaned dataset</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose which record to retain from each duplicate group.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={exportMode}
                onChange={(event) =>
                  setExportMode(
                    event.target.value as NonNullable<
                      UniqueCSVExportOptions["keep"]
                    >,
                  )
                }
                className="h-9 rounded-lg border border-border bg-card px-3 text-xs outline-none focus:border-primary"
              >
                <option value="most-complete">Keep most complete</option>
                <option value="first">Keep first record</option>
                <option value="exclude">Exclude duplicate groups</option>
              </select>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-border">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => handleTabChange("groups")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === "groups"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CopyCheck className="size-4" />
            Duplicate groups
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums">
              {result.duplicateGroupsCount}
            </span>
            {activeTab === "groups" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("unique")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === "unique"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            Unique records
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums">
              {result.uniqueRecordsCount}
            </span>
            {activeTab === "unique" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Search and sorting */}
      <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder={
              activeTab === "groups"
                ? "Search groups or record values..."
                : "Search unique records..."
            }
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {activeTab === "groups" && (
          <select
            value={groupSort}
            onChange={(event) => {
              setGroupSort(event.target.value as GroupSort);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            aria-label="Sort duplicate groups"
          >
            <option value="similarity">Highest similarity</option>
            <option value="size">Largest groups</option>
          </select>
        )}
      </div>

      {/* Result list */}
      {activeTab === "groups" ? (
        <div className="divide-y divide-border border-y border-border">
          {visibleItems.length > 0 ? (
            (visibleItems as typeof filteredGroups).map((group) => {
              const isExpanded = expandedGroup === group.groupId;
              const bestScore = getBestScore(group);

              return (
                <div key={group.groupId} className="py-2">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedGroup(isExpanded ? null : group.groupId)
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">
                      {String(group.groupId).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        Group {group.groupId}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {group.records.length} records ·{" "}
                        {group.duplicatePairs.length} pairs
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="font-mono text-sm font-semibold text-primary">
                        {(bestScore * 100).toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Best similarity
                      </p>
                    </div>

                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Group details */}
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isExpanded ? "1fr" : "0fr",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="space-y-4 px-3 pb-4 pt-2">
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Records in this group
                          </p>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {group.records.map((record, index) => (
                              <div
                                key={index}
                                className="rounded-lg border border-border bg-card/60 p-3"
                              >
                                <p className="text-[10px] font-medium text-muted-foreground">
                                  Record {index + 1}
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                  {getRecordLabel(record, fields)}
                                </p>

                                <div className="mt-3 space-y-1">
                                  {Object.entries(record).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex justify-between gap-3 text-xs"
                                      >
                                        <span className="text-muted-foreground">
                                          {key}
                                        </span>

                                        <span className="min-w-0 truncate text-right">
                                          {value || "—"}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Pair comparisons
                          </p>

                          <div className="space-y-2">
                            {group.duplicatePairs.map((pair, index) => (
                              <div
                                key={index}
                                className="rounded-lg border border-border bg-muted/20 p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-xs font-medium">
                                    Record {pair.firstRecordIndex + 1}
                                    <span className="mx-2 text-muted-foreground">
                                      ↔
                                    </span>
                                    Record {pair.secondRecordIndex + 1}
                                  </span>

                                  <span className="font-mono text-sm font-semibold text-primary">
                                    {(pair.score * 100).toFixed(2)}%
                                  </span>
                                </div>

                                {pair.fieldScores.length > 0 && (
                                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                                    {pair.fieldScores.map(
                                      (score, scoreIndex) => (
                                        <div
                                          key={`${score.sourceKey}-${scoreIndex}`}
                                          className="grid grid-cols-[1fr_65px_65px] items-center gap-2 text-xs"
                                        >
                                          <span className="truncate text-muted-foreground">
                                            {score.sourceKey}
                                          </span>

                                          <span className="text-right font-mono">
                                            {(score.score * 100).toFixed(1)}%
                                          </span>

                                          <span className="text-right text-muted-foreground">
                                            {Math.round(score.weight * 100)}%
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto size-8 text-primary" />

              <p className="mt-3 text-sm font-semibold">
                No duplicate groups found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "All records appear unique with the current configuration."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {visibleItems.length > 0 ? (
            (visibleItems as typeof filteredUniqueRecords).map(
              (record, index) => (
                <div
                  key={(currentPage - 1) * pageSize + index}
                  className="flex items-start gap-3 py-4"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Users className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {getRecordLabel(record, fields)}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(record).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs text-muted-foreground"
                        >
                          {key}:{" "}
                          <span className="text-foreground">
                            {value || "—"}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                    Unique
                  </span>
                </div>
              ),
            )
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold">No unique records found</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "Every record belongs to a duplicate group."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Duplicate detection does not modify or remove records from your original
        dataset. Review the groups before deciding which records to retain.
      </p>
    </section>
  );
}
