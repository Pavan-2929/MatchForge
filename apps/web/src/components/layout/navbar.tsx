"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ThemeToggle } from "../ThemeToggle";

const routeLabels: Record<string, string> = {
  "": "Introduction",
  installation: "Installation",
  preprocessing: "Preprocessing",
  compare: "String Comparison",
  "record-matching": "Record Matching",
  "csv-record-matching": "CSV Record Matching",
  "dataset-deduplication": "Dataset Deduplication",
  "csv-dataset-deduplication": "CSV Dataset Deduplication",
  blocking: "Blocking",
  "matching-evaluation": "Matching Evaluation",
  "blocking-evaluation": "Blocking Evaluation",
  "csv-evaluation": "CSV Evaluation",
  "csv-blocking-evaluation": "CSV Blocking Evaluation",
};

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isPlayground = segments.at(-1) === "playground";

  const pageSlug = isPlayground
    ? (segments.at(-2) ?? "")
    : (segments.at(-1) ?? "");

  const basePath = isPlayground
    ? `/${segments.slice(0, -1).join("/")}`
    : pathname;

  const pageTitle = routeLabels[pageSlug] ?? "Documentation";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>

          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>

            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />

            {isPlayground ? (
              <>
                <Link
                  href={basePath}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {pageTitle}
                </Link>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium text-foreground">
                  Playground
                </span>
              </>
            ) : (
              <span className="truncate font-medium text-foreground">
                {pageTitle}
              </span>
            )}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://github.com/Pavan-2929/MatchForge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <SiGithub className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
