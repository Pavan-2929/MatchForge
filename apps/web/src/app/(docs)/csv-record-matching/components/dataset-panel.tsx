"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CSVDataset } from "../types";

type Props = {
  label: "A" | "B";
  dataset: CSVDataset;
  onUpload: (fileName: string, csvText: string) => void;
};

export function DatasetPanel({ label, dataset, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);

      const csvText = await file.text();

      if (!csvText.trim()) {
        setError("The selected CSV file is empty.");
        return;
      }

      onUpload(file.name, csvText);
    } catch {
      setError("Unable to read the selected file.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const headers = dataset.parsed.headers;
  const records = dataset.parsed.records;
  const previewRecords = records.slice(0, 5);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
            {label}
          </span>

          <div>
            <p className="text-sm font-semibold">
              {label === "A" ? "Source dataset" : "Target dataset"}
            </p>

            <p className="text-xs text-muted-foreground">
              {records.length} records · {headers.length} columns
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          <Upload />
          {loading ? "Reading..." : "Upload CSV"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileSpreadsheet className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{dataset.fileName}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {headers.length} columns · {records.length} records
            </p>
          </div>

          <CheckCircle2 className="size-4 shrink-0 text-primary" />
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {dataset.parsed.errors.length > 0 && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="flex items-center gap-2 text-xs font-medium text-destructive">
            <AlertCircle className="size-4" />
            {dataset.parsed.errors.length} parsing errors
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {dataset.parsed.errors[0].message}
          </p>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between bg-muted/50 px-3 py-2.5">
          <span className="text-xs font-medium">Dataset preview</span>

          <span className="text-[10px] text-muted-foreground">
            Showing {previewRecords.length} of {records.length} records
          </span>
        </div>

        {headers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-left text-xs">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="whitespace-nowrap border-b border-border bg-muted/20 px-3 py-2.5 font-medium text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {previewRecords.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0"
                  >
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="max-w-40 truncate px-3 py-2.5"
                      >
                        {record[header] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            No columns detected in this CSV.
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Upload a different CSV file to replace this dataset.
      </p>
    </div>
  );
}
