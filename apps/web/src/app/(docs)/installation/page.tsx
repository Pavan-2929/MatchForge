import Link from "next/link";
import {
  ArrowUpRight,
  Check,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const installCommands = {
  npm: "npm install @matchforge/core",
  pnpm: "pnpm add @matchforge/core",
  yarn: "yarn add @matchforge/core",
  bun: "bun add @matchforge/core",
};

const verifyCode = `import { normalizeString } from "@matchforge/core";

const result = normalizeString("  HELLO   WORLD  ");

console.log(result);
// "hello world"`;

const importCode = `import {
  normalizeString,
  compareStrings,
  matchRecords,
} from "@matchforge/core";`;

const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export default function InstallationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Installation
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Install MatchForge Core from npm and use its string similarity,
            preprocessing, and record-matching functionality in your JavaScript
            or TypeScript project.
          </p>

          <div className="my-10 border-t border-border" />

          <section id="prerequisites" className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Prerequisites
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You need a JavaScript or TypeScript project with a package
              manager. MatchForge Core is distributed as an ECMAScript module
              and includes TypeScript declaration files.
            </p>
          </section>

          <section id="install" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Install the package
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Install the published package using your preferred package
              manager. If you use npm, run:
            </p>

            <div className="mt-5">
              <CodeBlock code={installCommands.npm} />
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Alternatively, use one of these package managers:
            </p>

            <PackageManagerCommands />
          </section>

          <section id="verify" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Verify the installation
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Import a function from the package and run a small example to
              check that it is available in your project.
            </p>

            <div className="mt-5">
              <CodeBlock code={verifyCode} language="typescript" />
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-accent/40 p-4">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                The expected output is{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  hello world
                </code>
                . This example uses the default normalization options.
              </p>
            </div>
          </section>

          <section id="imports" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Import the functionality you need
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              MatchForge exposes its functionality through named exports. Import
              only the functions and types required by your application.
            </p>

            <div className="mt-5">
              <CodeBlock code={importCode} language="typescript" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              You can also import individual similarity algorithms, text
              normalization options, and matching types. See the{" "}
              <Link
                href="/api-reference"
                className="font-medium text-primary underline underline-offset-4"
              >
                API reference
              </Link>{" "}
              for the complete export list.
            </p>
          </section>

          <section id="package-details" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">
              Package details
            </h2>

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              {[
                ["Package", "@matchforge/core"],
                ["Current published version", "0.1.0"],
                ["Module format", "ESM"],
                ["Type declarations", "Included"],
                ["License", "MIT"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_1fr] gap-4 border-b border-border px-4 py-3 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-right font-mono text-xs font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://www.npmjs.com/package/@matchforge/core"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
            >
              View package on npm
              <ArrowUpRight className="size-3.5" />
            </a>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold">ON THIS PAGE</p>
            <nav className="space-y-3 border-l border-border pl-4">
              {[
                ["Prerequisites", "#prerequisites"],
                ["Install the package", "#install"],
                ["Verify installation", "#verify"],
                ["Imports", "#imports"],
                ["Package details", "#package-details"],
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
          </div>
        </aside>
      </div>
    </main>
  );
}

function PackageManagerCommands() {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border">
      {packageManagers.map((manager) => (
        <div
          key={manager}
          className="grid grid-cols-[64px_1fr] items-center gap-3 border-b border-border px-4 py-3 last:border-0"
        >
          <span className="text-xs font-semibold">{manager}</span>
          <code className="overflow-x-auto whitespace-nowrap text-xs text-muted-foreground">
            {installCommands[manager]}
          </code>
        </div>
      ))}
    </div>
  );
}
