"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Database,
  Filter,
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
    icon: Database,
  },
  {
    number: "02",
    title: "Normalize the text",
    description:
      "Standardize casing, whitespace, punctuation, and accents before comparison.",
    icon: ScanText,
  },
  {
    number: "03",
    title: "Generate candidates",
    description:
      "Use blocking rules to reduce the number of record pairs that need comparison.",
    icon: Filter,
  },
  {
    number: "04",
    title: "Compare similarities",
    description:
      "Apply similarity algorithms to measure how closely candidate records resemble each other.",
    icon: GitCompareArrows,
  },
  {
    number: "05",
    title: "Connect related records",
    description:
      "Combine field-level comparisons to identify likely matching records.",
    icon: Link2,
  },
];

const records = {
  source: {
    name: "JORDAN LEE",
    email: "JORDAN@EXAMPLE.COM",
    city: "Ahmedabad",
  },
  target: {
    name: "Jordan Leigh",
    email: "jordan@example.com",
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
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="min-h-[340px]"
      >
        {/* Stage 1: Input data */}
        {stage === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <DataCard label="Source dataset" record={records.source} />
            <DataCard label="Target dataset" record={records.target} />

            <div className="rounded-lg border border-dashed border-border p-3 sm:col-span-2">
              <p className="text-xs font-medium">The challenge</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Differences in spelling, formatting, and missing information
                make direct equality checks unreliable.
              </p>
            </div>
          </div>
        )}

        {/* Stage 2: Normalization */}
        {stage === 1 && (
          <div className="space-y-4">
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
                  name: "jordan lee",
                  email: "jordan@example.com",
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
              Normalization options are configurable. Punctuation and accent
              removal are optional.
            </p>
          </div>
        )}

        {/* Stage 3: Blocking */}
        {stage === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Candidate generation
                </span>
                <Filter className="size-4 text-primary" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">
                    Source record
                  </p>
                  <p className="mt-2 text-xs font-semibold">Jordan Lee</p>
                </div>

                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">
                    Blocking key
                  </p>
                  <p className="mt-2 font-mono text-xs font-semibold">JOR</p>
                </div>
              </div>

              <div className="my-4 flex justify-center">
                <ArrowRight className="size-4 rotate-90 text-primary" />
              </div>

              <div className="rounded-lg border border-primary/20 bg-accent/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">
                    Candidate records
                  </span>
                  <span className="text-[10px] text-primary">
                    Blocking result
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {["Jordan Leigh", "Jordan Lee"].map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 rounded-md border border-border/70 bg-background px-3 py-2"
                    >
                      <Check className="size-3.5 text-primary" />
                      <span className="text-xs font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Blocking rules such as exact, prefix, and Soundex generate
              candidate pairs. This avoids comparing every possible pair.
            </p>
          </div>
        )}

        {/* Stage 4: Similarity */}
        {stage === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Compare candidate records
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">String A</p>
                  <p className="mt-1 font-mono text-xs">jordan lee</p>
                </div>

                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] text-muted-foreground">String B</p>
                  <p className="mt-1 font-mono text-xs">jordan leigh</p>
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
                  className="rounded-lg border border-border p-3"
                >
                  <GitCompareArrows className="mb-2 size-4 text-primary" />
                  <p className="text-xs font-medium">{method}</p>
                </div>
              ))}
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Different algorithms use different approaches to compare strings.
              MatchForge provides a consistent comparison API.
            </p>
          </div>
        )}

        {/* Stage 5: Record matching */}
        {stage === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/25 bg-accent/50 p-4">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-primary">
                <Link2 className="size-4" />
                Potential matching records
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Dataset A</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    Jordan Lee
                  </p>
                  <p className="mt-1 truncate text-[10px] text-muted-foreground">
                    jordan@example.com
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="rounded-full border border-primary/30 bg-background p-2">
                    <Link2 className="size-4 text-primary" />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Dataset B</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    Jordan Leigh
                  </p>
                  <p className="mt-1 truncate text-[10px] text-muted-foreground">
                    jordan@example.com
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["Name", "Email", "City"].map((field) => (
                <div
                  key={field}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="text-xs font-medium">{field}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-primary">
                    <Check className="size-3" />
                    Compared
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

  const goToNextStage = () => {
    setActiveStage((current) => (current + 1) % stages.length);
  };

  return (
    <section className="py-20 sm:py-28" id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From inconsistent records to meaningful connections.
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Entity resolution involves more than comparing strings. MatchForge
            combines preprocessing, blocking, similarity algorithms, and record
            matching in one toolkit.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Stage navigation */}
          <div className="space-y-2">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const selected = activeStage === index;
              const completed = index < activeStage;

              return (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => setActiveStage(index)}
                  aria-pressed={selected}
                  className={`group w-full rounded-xl border p-4 text-left transition-colors duration-200 ${
                    selected
                      ? "border-primary/30 bg-accent/60"
                      : "border-transparent hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : completed
                            ? "bg-primary/10 text-primary"
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

          {/* Interactive visualization */}
          <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <ActiveIcon className="size-4 shrink-0 text-primary" />
                <span className="truncate text-xs font-semibold">
                  {active.number} / 05 — {active.title}
                </span>
              </div>

              <span className="shrink-0 text-[10px] text-muted-foreground">
                Interactive overview
              </span>
            </div>

            <div className="mb-5 flex gap-1.5" aria-label="Workflow progress">
              {stages.map((stage, index) => (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => setActiveStage(index)}
                  aria-label={`Go to stage ${index + 1}: ${stage.title}`}
                  aria-current={activeStage === index ? "step" : undefined}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                    index <= activeStage ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <StageVisualization stage={activeStage} />

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-[10px] text-muted-foreground">
                Step {activeStage + 1} of {stages.length}
              </span>

              <button
                type="button"
                onClick={goToNextStage}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent"
              >
                {activeStage === stages.length - 1
                  ? "Start again"
                  : "Next stage"}
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
