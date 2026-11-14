"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dataset, DataRecord } from "../types";

type Props = {
  dataset: Dataset;
  onChange: (dataset: Dataset) => void;
};

export function DatasetPanel({ dataset, onChange }: Props) {
  const updateCell = (rowIndex: number, header: string, value: string) => {
    const records = dataset.records.map((record, index) =>
      index === rowIndex ? { ...record, [header]: value } : record,
    );

    onChange({ ...dataset, records });
  };

  const addRow = () => {
    const newRecord: DataRecord = Object.fromEntries(
      dataset.headers.map((header) => [header, ""]),
    );

    onChange({
      ...dataset,
      records: [...dataset.records, newRecord],
    });
  };

  const removeRow = (rowIndex: number) => {
    onChange({
      ...dataset,
      records: dataset.records.filter((_, index) => index !== rowIndex),
    });
  };

  return (
    <section>
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold">{dataset.name}</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {dataset.records.length} records · {dataset.headers.length} columns
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus />
          Add record
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[500px] text-left text-xs">
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
            {dataset.records.map((record, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border">
                {dataset.headers.map((header) => (
                  <td key={header} className="min-w-32 p-2">
                    <input
                      value={record[header] ?? ""}
                      onChange={(event) =>
                        updateCell(rowIndex, header, event.target.value)
                      }
                      className="h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-xs outline-none transition-colors hover:border-border focus:border-primary focus:bg-background"
                      aria-label={`${header}, record ${rowIndex + 1}`}
                    />
                  </td>
                ))}

                <td className="px-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(rowIndex)}
                    title="Remove record"
                    aria-label={`Remove record ${rowIndex + 1}`}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}

            {dataset.records.length === 0 && (
              <tr>
                <td
                  colSpan={dataset.headers.length + 1}
                  className="py-10 text-center text-muted-foreground"
                >
                  No records. Add a record to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Edit values directly or add and remove records.
      </p>
    </section>
  );
}
