import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { SiGithub, SiNpm } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group flex w-fit items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <GitCompareArrows className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">MatchForge</p>
              <p className="text-[11px] text-muted-foreground">
                String matching toolkit
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://www.npmjs.com/package/@matchforge/core"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-accent hover:text-foreground"
            >
              <SiNpm className="size-4" />
              npm package
            </a>

            <a
              href="https://github.com/Pavan-2929/MatchForge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MatchForge on GitHub"
              className="flex size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/30 hover:bg-accent hover:text-foreground"
            >
              <SiGithub className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-border/60 pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MatchForge. Released under MIT.</p>{" "}
          <p>Open source · Built for developers</p>
        </div>
      </div>
    </footer>
  );
}
