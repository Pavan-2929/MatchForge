"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { findDuplicates } from "@matchforge/core";
import { Button } from "@/components/ui/button";

import { DatasetPanel } from "../components/dataset-panel";
import { DeduplicationSettings } from "../components/deduplication-settings";
import { DeduplicationResults } from "../components/deduplication-results";

import type {
  DataRecord,
  Dataset,
  DeduplicationField,
  DeduplicationResult,
  DeduplicationSettings as Settings,
} from "../types";

const demoRecords: DataRecord[] = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    city: "Ahmedabad",
  },
  {
    name: "Rahul S Sharma",
    email: "rahul.sharma@gmail.com",
    city: "Ahmedabad",
  },
  {
    name: "Priya Patel",
    email: "priya.patel@gmail.com",
    city: "Surat",
  },
  {
    name: "Priya P Patel",
    email: "priya.patel@gmail.com",
    city: "Surat",
  },
  {
    name: "Amit Shah",
    email: "amit.shah@gmail.com",
    city: "Vadodara",
  },
  {
    name: "Neha Desai",
    email: "neha.desai@gmail.com",
    city: "Rajkot",
  },
];

const initialDataset: Dataset = {
  name: "Customer dataset",
  headers: ["name", "email", "city"],
  records: demoRecords,
};

const initialFields: DeduplicationField[] = [
  { key: "name", weight: 0.6 },
  { key: "email", weight: 0.4 },
];

const initialSettings: Settings = {
  method: "jaro-winkler",
  threshold: 0.85,
  normalization: {
    lowercase: true,
    trim: true,
    removeAccents: true,
    normalizeWhitespace: true,
  },
};

export default function DatasetDeduplicationPlayground() {
  const [dataset, setDataset] = useState<Dataset>(initialDataset);

  const [fields, setFields] = useState<DeduplicationField[]>(initialFields);

  const [settings, setSettings] = useState<Settings>(initialSettings);

  const [result, setResult] = useState<DeduplicationResult | null>(null);

  const [error, setError] = useState("");

  const updateDataset = (updatedDataset: Dataset) => {
    setDataset(updatedDataset);
    setResult(null);
    setError("");
  };

  const reset = () => {
    setDataset({
      ...initialDataset,
      records: initialDataset.records.map((record) => ({ ...record })),
    });

    setFields([...initialFields]);

    setSettings({
      ...initialSettings,
      normalization: { ...initialSettings.normalization },
    });

    setResult(null);
    setError("");
  };

  const runDeduplication = () => {
    if (dataset.records.length < 2) {
      setError("Add at least two records to detect duplicates.");
      return;
    }

    if (!fields.length) {
      setError("Select at least one field for comparison.");
      return;
    }

    if (!fields.some((field) => field.weight > 0)) {
      setError(
        "At least one selected field must have a weight greater than zero.",
      );
      return;
    }

    const invalidField = fields.some(
      (field) => !dataset.headers.includes(field.key),
    );

    if (invalidField) {
      setError("Choose valid fields from the dataset.");
      return;
    }

    try {
      const deduplicationResult = findDuplicates(dataset.records, {
        fields,
        method: settings.method,
        threshold: settings.threshold,
        normalization: settings.normalization,
      });

      setResult(deduplicationResult);
      setError("");
    } catch (error) {
      setResult(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while detecting duplicates.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-7">
      <Link
        href="/dataset-deduplication"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Dataset Deduplication Docs
      </Link>

      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dataset Deduplication
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Explore how MatchForge detects duplicate records within a dataset.
            Edit the sample data, select comparison fields, configure similarity
            settings, and find duplicates.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset demo
        </Button>
      </header>

      {/* Dataset */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">01</span>

            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Dataset
            </h2>
          </div>

          <span className="text-xs text-muted-foreground">
            Editable sample data
          </span>
        </div>

        <DatasetPanel dataset={dataset} onChange={updateDataset} />
      </section>

      {/* Configuration */}
      <DeduplicationSettings
        headers={dataset.headers}
        fields={fields}
        setFields={setFields}
        settings={settings}
        setSettings={setSettings}
        onRun={runDeduplication}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      <DeduplicationResults
        result={result}
        fields={fields}
        records={dataset.records}
        headers={dataset.headers}
      />
    </main>
  );
}
