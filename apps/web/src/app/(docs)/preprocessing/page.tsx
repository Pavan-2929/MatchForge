import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  GitCompareArrows,
  Info,
  Layers3,
  ScanText,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";

const basicExample = `import { normalizeString } from "@matchforge/core";

const result = normalizeString("  NEW   DELHI  ");

console.log(result);
// "new delhi"`;

const fullExample = `import { normalizeString } from "@matchforge/core";

const result = normalizeString("  José   SHARMA!  ", {
  lowercase: true,
  trim: true,
  normalizeWhitespace: true,
  removeAccents: true,
  removePunctuation: true,
});

console.log(result);
// "jose sharma"`;

const options = [
  {
    name: "lowercase",
    defaultValue: true,
    description: "Converts text to lowercase.",
  },
  {
    name: "trim",
    defaultValue: true,
    description: "Removes whitespace from the beginning and end.",
  },
  {
    name: "normalizeWhitespace",
    defaultValue: true,
    description: "Replaces consecutive whitespace with a single space.",
  },
  {
    name: "removePunctuation",
    defaultValue: false,
    description: "Removes punctuation characters.",
  },
  {
    name: "removeAccents",
    defaultValue: false,
    description: "Removes accents from characters, e.g. José → Jose.",
  },
];

export default function PreprocessingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Preprocessing
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Text preprocessing prepares strings for comparison by handling
            differences in casing, whitespace, punctuation, and accents.
            MatchForge provides{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
              normalizeString()
            </code>{" "}
            to apply these transformations with configurable options.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/preprocessing/playground"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try in playground
              <ArrowUpRight className="size-4" />
            </Link>
            <Button
              variant="ghost"
              className="group h-10 rounded-lg border border-border p-0 transition-all duration-300 hover:border-primary/40 hover:bg-accent/50"
            >
              <a
                href="#basic-usage"
                className="inline-flex h-full w-full items-center justify-center gap-2 px-4 text-sm font-medium"
              >
                Scroll to Discover
                <ArrowDown className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-y-1 group-hover:text-primary" />
              </a>
            </Button>
          </div>

          <div className="my-10 border-t border-border" />

          <section id="basic-usage" className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Basic usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Import{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                normalizeString()
              </code>{" "}
              from the package and pass the input string. The default options
              convert text to lowercase, trim its edges, and normalize
              consecutive whitespace.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
          </section>

          <section id="options" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Normalization options
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Customize how input strings are normalized before comparison.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Option</th>
                    <th className="px-3 py-3 font-medium">Default</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {options.map((option) => (
                    <tr key={option.name}>
                      <td className="px-3 py-3 font-mono text-xs">
                        {option.name}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                        {String(option.defaultValue)}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {option.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="custom-options" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Configure normalization
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Pass a configuration object to enable or disable individual
              transformations. The following example enables every available
              normalization option.
            </p>

            <div className="mt-5">
              <CodeBlock code={fullExample} language="typescript" />
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-accent/40 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                Options can be disabled explicitly by setting them to{" "}
                <code className="rounded bg-muted px-1 text-foreground">
                  false
                </code>
                . Passing an empty object or omitting the options argument uses
                the default behavior.
              </p>
            </div>
          </section>

          <section id="important" className="mt-12 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Important considerations
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Best practices
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Keep these guidelines in mind when preparing strings for
              comparison.
            </p>

            <div className="mt-6 divide-y divide-border border-y border-border">
              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <ScanText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Choose the right transformations
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Removing punctuation or accents can change meaningful
                    characters. Enable these options only when appropriate for
                    your data.
                  </p>
                </div>
                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  01
                </span>
              </div>

              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Layers3 className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Keep preprocessing consistent
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Apply the same normalization settings to corresponding
                    fields across your source and target datasets.
                  </p>
                </div>
                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  02
                </span>
              </div>

              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <GitCompareArrows className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Separate normalization from comparison
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Normalization prepares strings. Similarity algorithms
                    calculate how closely the prepared strings match.
                  </p>
                </div>
                <span className="pt-1 font-mono text-xs text-muted-foreground">
                  03
                </span>
              </div>
            </div>
          </section>

          <div className="mt-14">
            <p className="text-xs text-muted-foreground">NEXT</p>
            <Link
              href="/compare"
              className="group mt-3 flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
            >
              <div>
                <p className="text-sm font-semibold">String comparison</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore the similarity algorithms available in MatchForge.
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold">ON THIS PAGE</p>
            <nav className="space-y-3 border-l border-border pl-4">
              {[
                ["Basic usage", "#basic-usage"],
                ["Normalization options", "#options"],
                ["Configure normalization", "#custom-options"],
                ["Important considerations", "#important"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </nav>

            <Link
              href="/preprocessing/playground"
              className="group mt-8 block rounded-xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">Try the Playground</h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Experiment with normalization and see the results instantly.
              </p>

              <p className="mt-4 text-xs font-medium text-primary">
                Open Playground
              </p>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
