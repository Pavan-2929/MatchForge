"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { matchCSV, parseCSV } from "@matchforge/core";

import type {
  CSVDataset,
  FieldMapping as FieldMappingType,
  MatchingSettings,
  MatchingResult,
} from "../types";

import { Button } from "@/components/ui/button";
import { DatasetPanel } from "../components/dataset-panel";
import { FieldMapping } from "../components/field-mapping";
import { MatchingResults } from "../components/matching-results";

const demoSourceCSV = `name,city,email
Rahul Sharma,Ahmedabad,rahul.sharma@gmail.com
Priya Patel,Surat,priya.patel@gmail.com
Amit Shah,Vadodara,amit.shah@gmail.com
Neha Desai,Rajkot,neha.desai@gmail.com
Karan Mehta,Gandhinagar,karan.mehta@gmail.com`;

const demoTargetCSV = `full_name,location,email_address
Priya P Patel,Surat,priya.patel@gmail.com
Suresh Kumar,Delhi,suresh.kumar@gmail.com
Amit Shah,Vadodara,amit.shah@gmail.com
Rahul S Sharma,Ahmedabad,rahul.sharma@gmail.com
Pooja Verma,Mumbai,pooja.verma@gmail.com`;

function createDataset(
  name: string,
  fileName: string,
  csvText: string,
): CSVDataset {
  return {
    name,
    fileName,
    csvText,
    parsed: parseCSV(csvText),
  };
}

function createDefaultMappings(
  source: CSVDataset,
  target: CSVDataset,
): FieldMappingType[] {
  const sourceHeaders = source.parsed.headers;
  const targetHeaders = target.parsed.headers;

  return sourceHeaders
    .map((sourceKey, index) => {
      const targetKey = targetHeaders.includes(sourceKey)
        ? sourceKey
        : targetHeaders[index];

      if (!targetKey) return null;

      return {
        id: index + 1,
        sourceKey,
        targetKey,
        weight: sourceHeaders.length === 1 ? 1 : 0.5,
      };
    })
    .filter((field): field is FieldMappingType => field !== null);
}

const initialSource = createDataset(
  "Source dataset",
  "source-demo.csv",
  demoSourceCSV,
);

const initialTarget = createDataset(
  "Target dataset",
  "target-demo.csv",
  demoTargetCSV,
);

const initialSettings: MatchingSettings = {
  method: "jaro-winkler",
  threshold: 0.8,
  normalization: {
    lowercase: true,
    trim: true,
    removeAccents: true,
    normalizeWhitespace: true,
  },
};

export default function CSVRecordMatchingPlayground() {
  const [source, setSource] = useState<CSVDataset>(initialSource);
  const [target, setTarget] = useState<CSVDataset>(initialTarget);

  const [fields, setFields] = useState<FieldMappingType[]>(() =>
    createDefaultMappings(initialSource, initialTarget),
  );

  const [settings, setSettings] = useState<MatchingSettings>(initialSettings);

  const [result, setResult] = useState<MatchingResult | null>(null);
  const [error, setError] = useState("");

  const updateSource = (fileName: string, csvText: string) => {
    const dataset = createDataset("Source dataset", fileName, csvText);

    setSource(dataset);
    setFields(createDefaultMappings(dataset, target));
    setResult(null);
    setError("");
  };

  const updateTarget = (fileName: string, csvText: string) => {
    const dataset = createDataset("Target dataset", fileName, csvText);

    setTarget(dataset);
    setFields(createDefaultMappings(source, dataset));
    setResult(null);
    setError("");
  };

  const reset = () => {
    setSource(initialSource);
    setTarget(initialTarget);
    setFields(createDefaultMappings(initialSource, initialTarget));
    setSettings({ ...initialSettings });
    setResult(null);
    setError("");
  };

  const runMatching = () => {
    if (!source.parsed.records.length || !target.parsed.records.length) {
      setError("Both datasets must contain at least one valid record.");
      return;
    }

    if (!source.parsed.headers.length || !target.parsed.headers.length) {
      setError("Unable to detect CSV headers. Please check your files.");
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
        !source.parsed.headers.includes(field.sourceKey) ||
        !target.parsed.headers.includes(field.targetKey),
    );

    if (invalidMapping) {
      setError("Choose valid source and target columns for every mapping.");
      return;
    }

    if (!fields.some((field) => field.weight > 0)) {
      setError("At least one field must have a weight greater than zero.");
      return;
    }

    if (source.parsed.errors.length > 0 || target.parsed.errors.length > 0) {
      setError("Please resolve CSV parsing errors before running matching.");
      return;
    }

    try {
      const matchingResult = matchCSV(source.csvText, target.csvText, {
        fields: fields.map(({ sourceKey, targetKey, weight }) => ({
          sourceKey,
          targetKey,
          weight,
        })),
        method: settings.method,
        threshold: settings.threshold,
        topK: 3,
        normalization: settings.normalization,
      });

      setResult(matchingResult);
      setError("");
    } catch (error) {
      setResult(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while matching the datasets.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-7">
      <Link
        href="/csv-record-matching"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to CSV Record Matching Docs
      </Link>

      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            CSV Record Matching
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Compare two CSV datasets, map corresponding columns, configure
            similarity settings, and identify potential record matches.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset demo
        </Button>
      </header>

      {/* Dataset upload */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">01</span>

            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Upload datasets
            </h2>
          </div>

          <span className="text-xs text-muted-foreground">
            CSV files · Maximum 10 MB each
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <DatasetPanel label="A" dataset={source} onUpload={updateSource} />

          <DatasetPanel label="B" dataset={target} onUpload={updateTarget} />
        </div>
      </section>

      {/* Matching configuration */}
      <FieldMapping
        source={source}
        target={target}
        fields={fields}
        setFields={setFields}
        settings={settings}
        setSettings={setSettings}
        onRun={runMatching}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      <MatchingResults result={result} fields={fields} />
    </main>
  );
}
