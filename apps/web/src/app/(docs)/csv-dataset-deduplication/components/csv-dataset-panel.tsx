"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CSVParseResult } from "@matchforge/core";

export type CSVDataset = {
  name: string;
  fileName: string;
  csvText: string;
  parsed: CSVParseResult;
};

type Props = {
  dataset: CSVDataset;
  onUpload: (fileName: string, csvText: string) => void;
};

export function CSVDatasetPanel({ dataset, onUpload }: Props) {
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

  const { headers, records, errors } = dataset.parsed;
  const previewRecords = records.slice(0, 5);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileSpreadsheet className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{dataset.fileName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {records.length.toLocaleString()} records · {headers.length}{" "}
              columns
            </p>
          </div>

          <CheckCircle2 className="ml-1 size-4 shrink-0 text-emerald-500" />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="shrink-0"
        >
          <Upload />
          {loading ? "Reading..." : "Replace CSV"}
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

      {errors.length > 0 && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="flex items-center gap-2 text-xs font-medium text-destructive">
            <AlertCircle className="size-4" />
            {errors.length} parsing errors
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {errors[0].message}
          </p>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between bg-muted/50 px-3 py-2.5">
          <span className="text-xs font-medium">CSV preview</span>

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

                {previewRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="px-3 py-8 text-center text-muted-foreground"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
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
        Upload a different CSV file to replace the current dataset. Maximum file
        size: 10 MB.
      </p>
    </div>
  );
}
