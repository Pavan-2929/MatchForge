import { ArrowRight, Link2, Plus, Trash2 } from "lucide-react";
import type { SimilarityMethod } from "@matchforge/core";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Dataset, FieldMapping as Field, AlgorithmOption } from "../types";

type Props = {
  source: Dataset;
  target: Dataset;
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  method: SimilarityMethod;
  setMethod: (value: SimilarityMethod) => void;
  threshold: number;
  setThreshold: (value: number) => void;
  onRun: () => void;
};

const algorithms: AlgorithmOption[] = [
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

export function FieldMapping({
  source,
  target,
  fields,
  setFields,
  method,
  setMethod,
  threshold,
  setThreshold,
  onRun,
}: Props) {
  const updateField = (id: number, key: string, value: string | number) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, [key]: value } : field,
      ),
    );
  };

  const addField = () => {
    if (!source.headers.length || !target.headers.length) return;

    setFields((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((field) => field.id)) + 1,
        sourceKey: source.headers[0],
        targetKey: target.headers[0],
        weight: 0.2,
      },
    ]);
  };

  const removeField = (id: number) => {
    setFields((current) => current.filter((field) => field.id !== id));
  };

  return (
    <section className="mt-12 border-y border-border py-7">
      <div className="mb-6 flex items-center gap-2">
        <span className="font-mono text-xs text-primary">02</span>
        <h2 className="text-xs font-semibold uppercase tracking-wider">
          Matching configuration
        </h2>
      </div>

      {/* Field mapping */}
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-sm font-semibold">Field mapping</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose columns to compare and their contribution to the final score.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addField}
          disabled={!source.headers.length || !target.headers.length}
        >
          <Plus />
          Add field
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-xl border border-border bg-card/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                FIELD {index + 1}
              </span>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeField(field.id)}
                title="Remove field mapping"
              >
                <Trash2 />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_140px] sm:items-end">
              {/* Source column */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Source column
                </label>

                <Select
                  value={field.sourceKey}
                  onValueChange={(value) => {
                    if (value) updateField(field.id, "sourceKey", value);
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-background">
                    <SelectValue placeholder="Choose source column" />
                  </SelectTrigger>

                  <SelectContent>
                    {source.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target column */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Target column
                </label>

                <Select
                  value={field.targetKey}
                  onValueChange={(value) => {
                    if (value) updateField(field.id, "targetKey", value);
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-background">
                    <SelectValue placeholder="Choose target column" />
                  </SelectTrigger>

                  <SelectContent>
                    {target.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Weight
                  </label>
                  <span className="font-mono text-xs font-semibold text-primary">
                    {Math.round(field.weight * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={field.weight}
                  onChange={(e) =>
                    updateField(field.id, "weight", Number(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="text-sm font-medium">No fields configured</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a field mapping to compare selected columns.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>{fields.length} fields configured</span>
        <span>Weights are relative; they do not need to total 100%.</span>
      </div>

      {/* Algorithm and threshold */}
      <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Similarity algorithm
          </label>

          <Select
            value={method}
            onValueChange={(value) => {
              if (value) setMethod(value as SimilarityMethod);
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
              {(threshold * 100).toFixed(0)}%
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
          />

          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>10% · More matches</span>
            <span>100% · Exact matches</span>
          </div>
        </div>
      </div>

      {/* Run matching */}
      <div className="mt-6 flex flex-col justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium">Ready to compare your datasets?</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            MatchForge will compare the mapped fields, calculate similarity
            scores, and identify potential matches using your configuration.
          </p>
        </div>

        <Button
          onClick={onRun}
          disabled={
            !source.rows.length || !target.rows.length || !fields.length
          }
          className="shrink-0"
        >
          <Link2 />
          Run matching
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
