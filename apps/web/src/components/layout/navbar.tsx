"use client";

import {
  BookOpen,
  Code2,
  Database,
  FileCode2,
  GitCompareArrows,
  Menu,
  ScanText,
  Workflow,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { SiGithub } from "@icons-pack/react-simple-icons";

const sections = [
  {
    title: "GETTING STARTED",
    links: [
      { label: "Introduction", href: "/", icon: BookOpen },
      { label: "Installation", href: "/installation", icon: Code2 },
    ],
  },
  {
    title: "CORE CONCEPTS",
    links: [
      { label: "Preprocessing", href: "/preprocessing", icon: ScanText },
      {
        label: "String comparison",
        href: "/compare",
        icon: GitCompareArrows,
      },
      {
        label: "Record matching",
        href: "/record-matching",
        icon: Database,
      },
      {
        label: "Algorithm evaluation",
        href: "/algorithm-evaluation",
        icon: Workflow,
      },
    ],
  },
  {
    title: "REFERENCE",
    links: [
      { label: "API reference", href: "/api-reference", icon: FileCode2 },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const allLinks = sections.flatMap((section) => section.links);

  const isPlayground = pathname.endsWith("/playground");
  const basePath = isPlayground
    ? pathname.replace("/playground", "")
    : pathname;

  const pageTitle =
    allLinks.find((item) => item.href === basePath)?.label ?? "Documentation";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>

            <ChevronRight className="size-3.5 text-muted-foreground" />

            {isPlayground ? (
              <>
                <Link
                  href={basePath}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {pageTitle}
                </Link>

                <ChevronRight className="size-3.5 text-muted-foreground" />

                <span className="font-medium text-foreground">Playground</span>
              </>
            ) : (
              <span className="font-medium text-foreground">
                {basePath === "/" ? "Introduction" : pageTitle}
              </span>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Pavan-2929/MatchForge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <SiGithub className="size-4" />
            GitHub
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
