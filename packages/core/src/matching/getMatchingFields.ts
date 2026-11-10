import type { MatchingField, MatchingOptions } from "../types/matching.js";

export function getMatchingFields(options: MatchingOptions): MatchingField[] {
  const fields = options.fields ?? [
    {
      sourceKey: options.sourceKey,
      targetKey: options.targetKey,
      weight: 1,
    },
  ];

  if (!Array.isArray(fields)) {
    throw new TypeError("Fields must be an array.");
  }

  if (fields.length === 0) {
    throw new Error("At least one matching field is required.");
  }

  for (const field of fields) {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      throw new TypeError("Each matching field must be an object.");
    }
    
    const weight = field.weight ?? 1;

    if (!field.sourceKey || !field.targetKey) {
      throw new Error("Source and target keys are required.");
    }

    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error("Weight must be a finite, non-negative number.");
    }
  }

  if (fields.every((field) => (field.weight ?? 1) === 0)) {
    throw new Error("At least one field must have a positive weight.");
  }

  return fields;
}
