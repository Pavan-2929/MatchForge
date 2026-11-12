import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  GitCompareArrows,
} from "lucide-react";
import { ProcessVisualization } from "@/components/ProcessOverview";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,var(--color-accent),transparent_48%)] opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-6 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <h1 className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Make sense of
              <span className="text-primary"> imperfect data.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              MatchForge brings string similarity, text preprocessing, and
              record matching together to help discover relationships hidden in
              inconsistent data.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/installation"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                How it works
                <ArrowDownRight className="size-4" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                npm package
              </span>
              <span className="inline-flex items-center gap-2">
                <Braces className="size-4 text-primary" />
                TypeScript
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  The bigger picture
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  MATCHFORGE / CORE
                </span>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-2 shadow-2xl shadow-primary/5 backdrop-blur">
                <div className="rounded-xl bg-muted/30 p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="mb-2 text-[9px] uppercase tracking-wider text-muted-foreground">
                        Source
                      </p>
                      <p className="font-mono text-[11px] font-medium">
                        PAVAN K.
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                        PAVAN@GMAIL.COM
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="mb-2 text-[9px] uppercase tracking-wider text-muted-foreground">
                        Target
                      </p>
                      <p className="font-mono text-[11px] font-medium">
                        Pavan Kapadiya
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                        pavan@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center py-2">
                    <div className="h-5 w-px bg-primary/50" />
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-accent/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-primary">
                        MATCHING TOOLKIT
                      </span>
                      <GitCompareArrows className="size-4 text-primary" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {["Normalize", "Compare", "Resolve"].map((item) => (
                        <div
                          key={item}
                          className="rounded-md border border-primary/10 bg-background/70 px-2 py-2 text-center text-[9px] font-medium"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center py-2">
                    <div className="h-5 w-px bg-primary/50" />
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Link2Icon />
                      </span>
                      <div>
                        <p className="text-xs font-semibold">Related records</p>
                        <p className="text-[10px] text-muted-foreground">
                          Discover likely entity relationships
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] text-primary">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Conceptual illustration of the MatchForge workflow
              </p>
            </div>
          </div>
        </div>
      </section>

      <div id="how-it-works" className="scroll-mb-14">
        <ProcessVisualization />
      </div>

      <section className="border-y border-border/70 bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Built for developers
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with one package.
              <br />
              Build your own workflow.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Use MatchForge Core in your JavaScript or TypeScript application.
              Its matching logic is independent of any frontend framework.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/installation"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Read the documentation
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://www.npmjs.com/package/@matchforge/core"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                npm package
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-accent/60 text-foreground shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-medium">Terminal</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                npm
              </span>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="font-mono text-sm">
                <span className="mr-2 text-primary">$</span>
                npm install @matchforge/core
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Import what you need
                </p>

                <pre className="overflow-x-auto font-mono text-xs leading-6 text-foreground">
                  {`import {
  normalizeString,
  compareStrings,
  matchRecords,
} from "@matchforge/core";`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Link2Icon() {
  return <GitCompareArrows className="size-3.5" />;
}
