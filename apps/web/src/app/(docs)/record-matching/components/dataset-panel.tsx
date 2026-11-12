import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dataset, DataRecord } from "../types";

type DatasetPanelProps = {
  label: "A" | "B";
  dataset: Dataset;
  onChange: (dataset: Dataset) => void;
};

export function DatasetPanel({ label, dataset, onChange }: DatasetPanelProps) {
  const updateCell = (rowIndex: number, header: string, value: string) => {
    const rows = dataset.rows.map((row, index) =>
      index === rowIndex ? { ...row, [header]: value } : row,
    );

    onChange({ ...dataset, rows });
  };

  const addRow = () => {
    const newRow: DataRecord = Object.fromEntries(
      dataset.headers.map((header) => [header, ""]),
    );

    onChange({
      ...dataset,
      rows: [...dataset.rows, newRow],
    });
  };

  const removeRow = (rowIndex: number) => {
    onChange({
      ...dataset,
      rows: dataset.rows.filter((_, index) => index !== rowIndex),
    });
  };

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
              {dataset.rows.length} records · {dataset.headers.length} columns
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus />
          Add row
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] text-left text-xs">
          <thead className="bg-muted/50">
            <tr>
              {dataset.headers.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap px-3 py-3 font-medium text-muted-foreground"
                >
                  {header}
                </th>
              ))}

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody>
            {dataset.rows.map((record, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border">
                {dataset.headers.map((header) => (
                  <td key={header} className="min-w-32 p-2">
                    <input
                      value={record[header] ?? ""}
                      onChange={(event) =>
                        updateCell(rowIndex, header, event.target.value)
                      }
                      className="h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-xs outline-none transition-colors hover:border-border focus:border-primary focus:bg-background"
                      aria-label={`${header}, row ${rowIndex + 1}`}
                    />
                  </td>
                ))}

                <td className="px-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(rowIndex)}
                    title="Delete row"
                    aria-label={`Delete row ${rowIndex + 1}`}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}

            {dataset.rows.length === 0 && (
              <tr>
                <td
                  colSpan={dataset.headers.length + 1}
                  className="py-10 text-center text-muted-foreground"
                >
                  No records. Add a row to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Edit cell values directly or add and remove records.
      </p>
    </div>
  );
}
