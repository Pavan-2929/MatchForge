"use client";

import { ArrowRight, CopyCheck } from "lucide-react";
import type { NormalizeOptions, SimilarityMethod } from "@matchforge/core";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DeduplicationField, DeduplicationSettings } from "../types";

type Props = {
  headers: string[];
  fields: DeduplicationField[];
  setFields: React.Dispatch<React.SetStateAction<DeduplicationField[]>>;
  settings: DeduplicationSettings;
  setSettings: React.Dispatch<React.SetStateAction<DeduplicationSettings>>;
  onRun: () => void;
};

const algorithms: {
  value: SimilarityMethod;
  label: string;
}[] = [
  { value: "levenshtein", label: "Levenshtein" },
  { value: "damerau-levenshtein", label: "Damerau-Levenshtein" },
  { value: "jaro", label: "Jaro" },
  { value: "jaro-winkler", label: "Jaro-Winkler" },
  { value: "jaccard", label: "Jaccard" },
  { value: "dice", label: "Dice" },
  { value: "cosine", label: "Cosine" },
  { value: "soundex", label: "Soundex" },
  { value: "metaphone", label: "Metaphone" },
];

const normalizationOptions: {
  key: keyof NormalizeOptions;
  label: string;
}[] = [
  { key: "lowercase", label: "Convert to lowercase" },
  { key: "trim", label: "Trim whitespace" },
  { key: "removePunctuation", label: "Remove punctuation" },
  { key: "removeAccents", label: "Remove accents" },
  { key: "normalizeWhitespace", label: "Normalize whitespace" },
];

export function DeduplicationSettings({
  headers,
  fields,
  setFields,
  settings,
  setSettings,
  onRun,
}: Props) {
  const updateField = (key: string, weight: number) => {
    setFields((current) =>
      current.map((field) =>
        field.key === key ? { ...field, weight } : field,
      ),
    );
  };

  const toggleField = (key: string, checked: boolean) => {
    setFields((current) => {
      if (checked) {
        return [...current, { key, weight: 1 }];
      }

      return current.filter((field) => field.key !== key);
    });
  };

  function updateSettings<K extends keyof DeduplicationSettings>(
    key: K,
    value: DeduplicationSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const updateNormalization = (key: keyof NormalizeOptions, value: boolean) => {
    setSettings((current) => ({
      ...current,
      normalization: {
        ...current.normalization,
        [key]: value,
      },
    }));
  };

  const canRun =
    headers.length > 0 &&
    fields.length > 0 &&
    fields.some((field) => field.weight > 0);

  return (
    <section className="mt-12 border-y border-border py-7">
      <div className="mb-6 flex items-center gap-2">
        <span className="font-mono text-xs text-primary">02</span>

        <h2 className="text-xs font-semibold uppercase tracking-wider">
          Deduplication configuration
        </h2>
      </div>

      {/* Fields */}
      <div>
        <h3 className="text-sm font-semibold">Fields to compare</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Select the columns that should be considered when detecting
          duplicates.
        </p>

        <div className="mt-4 space-y-3">
          {headers.map((header) => {
            const field = fields.find((item) => item.key === header);

            return (
              <div
                key={header}
                className="rounded-xl border border-border bg-card/50 p-4"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:px-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(field)}
                      onChange={(event) =>
                        toggleField(header, event.target.checked)
                      }
                      className="size-4 accent-primary"
                    />

                    <span className="text-sm font-medium">{header}</span>
                  </label>

                  {field && (
                    <div className="flex items-center gap-3 sm:w-64">
                      <span className="text-xs text-muted-foreground">
                        Weight
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={field.weight}
                        onChange={(event) =>
                          updateField(header, Number(event.target.value))
                        }
                        className="h-2 flex-1 cursor-pointer accent-primary"
                      />

                      <span className="w-10 text-right font-mono text-xs font-semibold text-primary">
                        {Math.round(field.weight * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {fields.length} fields selected. Weights are relative and do not need
          to total 100%.
        </p>
      </div>

      {/* Algorithm and threshold */}
      <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Similarity algorithm
          </label>

          <Select
            value={settings.method}
            onValueChange={(value) => {
              if (value) {
                updateSettings("method", value as SimilarityMethod);
              }
            }}
          >
            <SelectTrigger className="h-10 w-full bg-card">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {algorithms.map((algorithm) => (
                <SelectItem key={algorithm.value} value={algorithm.value}>
                  {algorithm.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Minimum similarity
            </label>

            <span className="font-mono text-sm font-semibold text-primary">
              {(settings.threshold * 100).toFixed(0)}%
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={settings.threshold}
            onChange={(event) =>
              updateSettings("threshold", Number(event.target.value))
            }
            className="h-2 w-full cursor-pointer accent-primary"
          />

          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>10% · More matches</span>
            <span>100% · Exact matches</span>
          </div>
        </div>
      </div>

      {/* Normalization */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-sm font-semibold">Text normalization</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Preprocess field values before calculating similarity.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {normalizationOptions.map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={settings.normalization[option.key] ?? false}
                onChange={(event) =>
                  updateNormalization(option.key, event.target.checked)
                }
                className="size-4 accent-primary"
              />

              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Run */}
      <div className="mt-7 flex flex-col justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium">Ready to detect duplicates?</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            MatchForge will compare records, calculate weighted similarity
            scores, and group potential duplicates.
          </p>
        </div>

        <Button onClick={onRun} disabled={!canRun} className="shrink-0">
          <CopyCheck />
          Find duplicates
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
