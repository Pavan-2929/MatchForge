import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  GitCompareArrows,
  Info,
  Layers3,
  ScanText,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";

const basicExample = `import { compareStrings } from "@matchforge/core";

const score = compareStrings("Pavan Sharma", "Pavan S Sharma");

console.log(score);
// Similarity score between 0 and 1`;

const fullExample = `import { compareStrings } from "@matchforge/core";

const score = compareStrings("José Sharma", "Jose Sharma", {
  method: "jaro-winkler",
  normalization: {
    lowercase: true,
    trim: true,
    normalizeWhitespace: true,
    removeAccents: true,
    removePunctuation: false,
  },
});

console.log(score);`;

const methods = [
  {
    name: "levenshtein",
    description:
      "Measures similarity using insertions, deletions, and substitutions.",
  },
  {
    name: "damerau-levenshtein",
    description: "Also considers adjacent character transpositions.",
  },
  {
    name: "jaro",
    description: "Compares matching characters and their ordering.",
  },
  {
    name: "jaro-winkler",
    description:
      "Extends Jaro similarity by giving additional weight to common prefixes.",
  },
  {
    name: "jaccard",
    description: "Compares the overlap between character q-gram sets.",
  },
  {
    name: "dice",
    description: "Measures q-gram overlap using the Dice coefficient.",
  },
  {
    name: "cosine",
    description: "Compares strings using cosine similarity.",
  },
  {
    name: "soundex",
    description: "Compares phonetic codes based on pronunciation.",
  },
  {
    name: "metaphone",
    description: "Uses phonetic encoding to compare similar-sounding words.",
  },
];

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            String comparison
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            String comparison measures how similar two strings are. MatchForge
            provides multiple similarity algorithms for comparing names,
            addresses, and other text values through a consistent API.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/compare/playground"
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
              Use compareStrings() to compare two strings. It returns a
              similarity score between 0 and 1, where higher values indicate
              greater similarity. The default algorithm is Jaro-Winkler.
            </p>

            <div className="mt-5">
              <CodeBlock code={basicExample} language="typescript" />
            </div>
          </section>

          <section id="methods" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Similarity methods
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge provides nine methods. Each uses a different approach
              to measure similarity between strings.
            </p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 font-medium">Method</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {methods.map((method) => (
                    <tr key={method.name}>
                      <td className="px-3 py-3 align-top">
                        <code className="text-xs font-medium">
                          {method.name}
                        </code>
                      </td>

                      <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                        {method.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="configuration" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Configure comparison
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You can select a similarity method using the `method` option. You
              can also pass normalization options to preprocess both strings
              before comparison. This uses the same options available in
              `normalizeString()`.
            </p>

            <div className="mt-5">
              <CodeBlock code={fullExample} language="typescript" />
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-accent/40 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />

              <p className="text-xs leading-6 text-muted-foreground">
                The normalization option applies preprocessing to both input
                strings before calculating similarity. If omitted, the default
                normalization behavior is used.
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
              Consider these points when selecting a similarity method.
            </p>

            <div className="mt-6 divide-y divide-border border-y border-border">
              <div className="flex gap-4 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <ScanText className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    Choose the appropriate method
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Different algorithms handle character changes, ordering, and
                    pronunciation differently. Select a method based on your
                    data.
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
                    Normalize consistently
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Apply consistent normalization settings when comparing
                    values from different datasets.
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
                    Interpret scores carefully
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    A high similarity score does not always mean two records
                    refer to the same entity. Choose an appropriate threshold
                    for your application.
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
              href="/record-matching"
              className="group mt-3 flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
            >
              <div>
                <p className="text-sm font-semibold">Record matching</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Match records across two datasets using multiple fields.
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
                ["Similarity methods", "#methods"],
                ["Configure comparison", "#configuration"],
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
              href="/compare/playground"
              className="group mt-8 block rounded-xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Compare Two Strings
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Try different algorithms and compare their similarity scores.
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
