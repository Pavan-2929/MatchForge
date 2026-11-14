"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { findDuplicatesCSV, parseCSV } from "@matchforge/core";

import { Button } from "@/components/ui/button";

import { CSVDatasetPanel } from "../components/csv-dataset-panel";
import type { CSVDataset } from "../components/csv-dataset-panel";

import { DeduplicationSettings } from "../../dataset-deduplication/components/deduplication-settings";
import { DeduplicationResults } from "../../dataset-deduplication/components/deduplication-results";

import type {
  DeduplicationField,
  DeduplicationResult,
  DeduplicationSettings as Settings,
} from "../../dataset-deduplication/types";

import type { DuplicateCSVResult } from "@matchforge/core";

const demoCSV = `name,email,city,phone
Rahul Sharma,rahul.sharma@gmail.com,Ahmedabad,9876543210
Rahul S Sharma,rahul.sharma@gmail.com,Ahmedabad,9876543210
Priya Patel,priya.patel@gmail.com,Surat,9876543211
Priya P Patel,priya.patel@gmail.com,Surat,9876543211
Amit Shah,amit.shah@gmail.com,Vadodara,9876543212
Neha Desai,neha.desai@gmail.com,Rajkot,9876543213`;

function createDataset(fileName: string, csvText: string): CSVDataset {
  return {
    name: "Customer dataset",
    fileName,
    csvText,
    parsed: parseCSV(csvText),
  };
}

const initialDataset = createDataset("customer-data.csv", demoCSV);

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

function getDefaultFields(headers: string[]): DeduplicationField[] {
  const preferredFields = ["name", "email"];

  const selected = preferredFields
    .filter((key) => headers.includes(key))
    .map((key) => ({
      key,
      weight: key === "name" ? 0.6 : 0.4,
    }));

  if (selected.length > 0) {
    return selected;
  }

  return headers.slice(0, 2).map((key) => ({
    key,
    weight: 1,
  }));
}

export default function CSVDatasetDeduplicationPlayground() {
  const [dataset, setDataset] = useState<CSVDataset>(initialDataset);

  const [fields, setFields] = useState<DeduplicationField[]>(() =>
    getDefaultFields(initialDataset.parsed.headers),
  );

  const [settings, setSettings] = useState<Settings>(initialSettings);

  const [result, setResult] = useState<DuplicateCSVResult | null>(null);
  const [error, setError] = useState("");

  const updateDataset = (fileName: string, csvText: string) => {
    const updatedDataset = createDataset(fileName, csvText);

    setDataset(updatedDataset);
    setFields(getDefaultFields(updatedDataset.parsed.headers));
    setResult(null);
    setError("");
  };

  const reset = () => {
    setDataset(initialDataset);
    setFields(getDefaultFields(initialDataset.parsed.headers));
    setSettings({
      ...initialSettings,
      normalization: { ...initialSettings.normalization },
    });
    setResult(null);
    setError("");
  };

  const runDeduplication = () => {
    const { headers, records, errors } = dataset.parsed;

    if (!headers.length) {
      setError("Unable to detect CSV headers. Please check your file.");
      return;
    }

    if (records.length < 2) {
      setError("The CSV must contain at least two records.");
      return;
    }

    if (errors.length > 0) {
      setError(
        "Please resolve CSV parsing errors before running deduplication.",
      );
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

    const invalidField = fields.some((field) => !headers.includes(field.key));

    if (invalidField) {
      setError("Choose valid fields from the CSV columns.");
      return;
    }

    try {
      const deduplicationResult = findDuplicatesCSV(dataset.csvText, {
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
        href="/csv-dataset-deduplication"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to CSV Dataset Deduplication Docs
      </Link>

      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            CSV Dataset Deduplication
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Upload a CSV dataset, select comparison columns, configure
            similarity settings, and identify duplicate records.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset demo
        </Button>
      </header>

      {/* CSV dataset */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-primary">
                01
              </span>
              <h2 className="text-sm font-semibold">Upload your dataset</h2>
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              Choose a CSV file to inspect and identify duplicate records.
            </p>
          </div>

          <span className="w-fit rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
            CSV · Max 10 MB
          </span>
        </div>

        <CSVDatasetPanel dataset={dataset} onUpload={updateDataset} />
      </section>

      {/* Settings */}
      <DeduplicationSettings
        headers={dataset.parsed.headers}
        fields={fields}
        setFields={setFields}
        settings={settings}
        setSettings={setSettings}
        onRun={runDeduplication}
      />

      {/* Errors */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Results */}
      <DeduplicationResults
        result={result}
        fields={fields}
        records={result?.records ?? dataset.parsed.records}
        headers={result?.headers ?? dataset.parsed.headers}
      />
    </main>
  );
}
