"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { matchRecords, type SimilarityMethod } from "@matchforge/core";

import { Button } from "@/components/ui/button";
import { DatasetPanel } from "../components/dataset-panel";
import { FieldMapping } from "../components/field-mapping";
import { MatchingResults } from "../components/matching-results";

import {
  demoSource,
  demoTarget,
  initialMappings,
} from "../../../../data/record-matching";

import type { Dataset, FieldMapping as FieldMappingType } from "../types";
import Link from "next/link";

export default function RecordMatchingPage() {
  const [source, setSource] = useState<Dataset>(demoSource);
  const [target, setTarget] = useState<Dataset>(demoTarget);
  const [fields, setFields] = useState<FieldMappingType[]>(initialMappings);

  const [method, setMethod] = useState<SimilarityMethod>("jaro-winkler");
  const [threshold, setThreshold] = useState(0.8);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => {
    if (
      !hasRun ||
      !source.rows.length ||
      !target.rows.length ||
      !fields.length
    ) {
      return null;
    }

    return matchRecords(source.rows, target.rows, {
      fields: fields.map(({ sourceKey, targetKey, weight }) => ({
        sourceKey,
        targetKey,
        weight,
      })),
      method,
      threshold,
    });
  }, [source, target, fields, method, threshold, hasRun]);

  const updateSource = (dataset: Dataset) => {
    setSource(dataset);
    setHasRun(false);
    setError("");
  };

  const updateTarget = (dataset: Dataset) => {
    setTarget(dataset);
    setHasRun(false);
    setError("");
  };

  const reset = () => {
    setSource(demoSource);
    setTarget(demoTarget);
    setFields(initialMappings);
    setMethod("jaro-winkler");
    setThreshold(0.8);
    setError("");
    setHasRun(false);
  };

  const runMatching = () => {
    if (!source.rows.length || !target.rows.length) {
      setError("Add at least one record to both datasets.");
      return;
    }

    if (!fields.length) {
      setError("Add at least one field mapping.");
      return;
    }

    const invalidMapping = fields.some(
      (field) =>
        !field.sourceKey ||
        !field.targetKey ||
        !source.headers.includes(field.sourceKey) ||
        !target.headers.includes(field.targetKey),
    );

    if (invalidMapping) {
      setError("Choose a valid source and target field for every mapping.");
      return;
    }

    if (!fields.some((field) => field.weight > 0)) {
      setError("At least one field must have a weight greater than zero.");
      return;
    }

    setError("");
    setHasRun(true);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-7">
      <Link
        href="/preprocessing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Record-Matching Docs
      </Link>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Record Matching
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Explore how MatchForge identifies similar records across two
            datasets. Edit the demo records, configure field mappings, and run
            matching.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset demo
        </Button>
      </header>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">01</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Demo datasets
            </h2>
          </div>

          <span className="text-xs text-muted-foreground">
            Editable sample data
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <DatasetPanel label="A" dataset={source} onChange={updateSource} />

          <DatasetPanel label="B" dataset={target} onChange={updateTarget} />
        </div>
      </section>

      <FieldMapping
        source={source}
        target={target}
        fields={fields}
        setFields={setFields}
        method={method}
        setMethod={setMethod}
        threshold={threshold}
        setThreshold={setThreshold}
        onRun={runMatching}
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <MatchingResults result={result} fields={fields} />
    </main>
  );
}
