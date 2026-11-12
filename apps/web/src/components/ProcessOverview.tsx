"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  Link2,
  ScanText,
  Workflow,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Start with inconsistent data",
    description:
      "The same entity can appear differently across files, systems, and databases.",
    icon: ScanText,
  },
  {
    number: "02",
    title: "Normalize the text",
    description:
      "Prepare strings by handling casing, whitespace, punctuation, and accents.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Compare similarities",
    description:
      "Apply different algorithms to measure how closely two strings resemble each other.",
    icon: GitCompareArrows,
  },
  {
    number: "04",
    title: "Connect related records",
    description:
      "Combine field-level comparisons to identify likely matching records.",
    icon: Link2,
  },
];

const records = {
  source: {
    name: "PAVAN KAPADIYA",
    email: "PAVAN@GMAIL.COM",
    city: "Ahmedabad",
  },
  target: {
    name: "Pavan Kapadiya",
    email: "pavan@gmail.com",
    city: "Ahmedabad",
  },
};

function DataCard({
  label,
  record,
  muted = false,
}: {
  label: string;
  record: Record<string, string>;
  muted?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border p-3 ${
        muted ? "border-border/60 bg-background/50" : "border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="space-y-2.5">
        {Object.entries(record).map(([key, value]) => (
          <div key={key} className="min-w-0">
            <p className="text-[10px] text-muted-foreground">{key}</p>
            <p className="truncate font-mono text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageVisualization({ stage }: { stage: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="min-h-[310px]"
      >
        {stage === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <DataCard label="Source dataset" record={records.source} />
            <DataCard label="Target dataset" record={records.target} />
            <div className="sm:col-span-2 rounded-lg border border-dashed border-border p-3">
              <p className="text-xs font-medium">The challenge</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Differences in casing, formatting, spelling, and missing
                information make direct equality checks unreliable.
              </p>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <DataCard
                label="Before normalization"
                record={{
                  name: records.source.name,
                  email: records.source.email,
                }}
                muted
              />
              <DataCard
                label="After normalization"
                record={{
                  name: "pavan kapadiya",
                  email: "pavan@gmail.com",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["Lowercase", "Trim whitespace", "Normalize spacing"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[10px] text-primary"
                  >
                    <Check className="size-3" />
                    {item}
                  </span>
                ),
              )}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Normalization options can be configured. Punctuation and accent
              removal are optional.
            </p>
          </div>
        )}

        {stage === 2 && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Compare normalized strings
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">String A</p>
                  <p className="mt-1 font-mono text-xs">pavan kapadiya</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">String B</p>
                  <p className="mt-1 font-mono text-xs">pavan kapadiya</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "Levenshtein",
                "Jaro-Winkler",
                "Jaccard",
                "Dice",
                "Cosine",
                "Soundex",
              ].map((method) => (
                <div
                  key={method}
                  className="rounded-lg border border-border px-3 py-3"
                >
                  <GitCompareArrows className="mb-2 size-4 text-primary" />
                  <p className="text-xs font-medium">{method}</p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Each algorithm uses a different approach to compare strings.
              MatchForge provides a consistent comparison API.
            </p>
          </div>
        )}

        {stage === 3 && (
          <div className="space-y-3">
            <div className="rounded-xl border border-primary/25 bg-accent/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <Link2 className="size-4" />
                Related entity
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div>
                  <p className="text-[10px] text-muted-foreground">Dataset A</p>
                  <p className="mt-1 text-sm font-semibold">PAVAN KAPADIYA</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    PAVAN@GMAIL.COM
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-full border border-primary/30 bg-background p-2">
                    <Link2 className="size-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Dataset B</p>
                  <p className="mt-1 text-sm font-semibold">Pavan Kapadiya</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    pavan@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Name", "Compared"],
                ["Email", "Compared"],
                ["City", "Compared"],
              ].map(([field, status]) => (
                <div
                  key={field}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="text-xs font-medium">{field}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-primary">
                    <Check className="size-3" />
                    {status}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Multiple field comparisons can contribute to a weighted record
              score, helping identify likely corresponding records.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function ProcessVisualization() {
  const [activeStage, setActiveStage] = useState(0);
  const active = stages[activeStage];
  const ActiveIcon = active.icon;

  return (
    <section className="py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From inconsistent records to meaningful connections.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Entity resolution is more than comparing two strings. MatchForge
            brings preprocessing, similarity algorithms, and record matching
            together in one toolkit.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="space-y-2">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const selected = activeStage === index;

              return (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => setActiveStage(index)}
                  className={`group w-full rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? "border-primary/30 bg-accent/60"
                      : "border-transparent hover:border-border hover:bg-muted/40"
                  }`}
                  aria-pressed={selected}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">
                          {stage.title}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {stage.number}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ActiveIcon className="size-4 text-primary" />
                <span className="text-xs font-semibold">
                  {active.number} / 04 — {active.title}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Interactive overview
              </span>
            </div>

            <StageVisualization stage={activeStage} />

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-[10px] text-muted-foreground">
                Select a stage to explore
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveStage((current) => (current + 1) % stages.length)
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-opacity hover:opacity-75"
              >
                Next stage
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
