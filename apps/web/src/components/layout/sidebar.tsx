"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  Database,
  FileSpreadsheet,
  GitCompareArrows,
  ScanText,
  CopyCheck,
  Blocks,
  ChartNoAxesCombined,
  ChevronRight,
} from "lucide-react";
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
    title: "FOUNDATIONS",
    links: [
      { label: "Preprocessing", href: "/preprocessing", icon: ScanText },
      {
        label: "String Comparison",
        href: "/compare",
        icon: GitCompareArrows,
      },
    ],
  },
  {
    title: "RECORD OPERATIONS",
    links: [
      {
        label: "Record Matching",
        href: "/record-matching",
        icon: Database,
        children: [
          {
            label: "CSV Implementation",
            href: "/csv-record-matching",
          },
        ],
      },
      {
        label: "Dataset Deduplication",
        href: "/dataset-deduplication",
        icon: CopyCheck,
        children: [
          {
            label: "CSV Implementation",
            href: "/csv-dataset-deduplication",
          },
        ],
      },
      {
        label: "Blocking",
        href: "/blocking",
        icon: Blocks,
      },
    ],
  },
  {
    title: "EVALUATION",
    links: [
      {
        label: "Matching Evaluation",
        href: "/matching-evaluation",
        icon: ChartNoAxesCombined,
        children: [
          {
            label: "CSV Implementation",
            href: "/csv-evaluation",
          },
        ],
      },
      {
        label: "Blocking Evaluation",
        href: "/blocking-evaluation",
        icon: ChartNoAxesCombined,
        children: [
          {
            label: "CSV Implementation",
            href: "/csv-blocking-evaluation",
          },
        ],
      },
    ],
  },
];

type SidebarProps = {
  onNavigate?: () => void;
};

type NavigationItem = (typeof sections)[number]["links"][number];

function isRouteActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveParent(pathname: string) {
  for (const section of sections) {
    for (const item of section.links) {
      const isParentActive = isRouteActive(pathname, item.href);
      const isChildActive = item.children?.some((child) =>
        isRouteActive(pathname, child.href),
      );

      if (isParentActive || isChildActive) {
        return item.href;
      }
    }
  }

  return null;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const [openItem, setOpenItem] = useState<string | null>(() =>
    getActiveParent(pathname),
  );

  // Keep the relevant submenu open after navigation.
  useEffect(() => {
    setOpenItem(getActiveParent(pathname));
  }, [pathname]);

  const toggleItem = (href: string) => {
    setOpenItem((current) => (current === href ? null : href));
  };

  const renderItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isRouteActive(pathname, item.href);
    const childActive = item.children?.some((child) =>
      isRouteActive(pathname, child.href),
    );

    const expanded = openItem === item.href;

    return (
      <div key={item.href}>
        <div
          className={`group relative flex min-h-10 items-center rounded-lg transition-colors duration-200 ${
            active
              ? "bg-accent text-foreground"
              : childActive
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          }`}
        >
          {active && (
            <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" />
          )}

          {/* Navigation link */}
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3 pr-1 text-[13px]"
          >
            <Icon
              className={`size-[17px] shrink-0 transition-colors ${
                active || childActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
              strokeWidth={active ? 2.1 : 1.8}
            />

            <span className="truncate font-medium">{item.label}</span>
          </Link>

          {/* Independent accordion control */}
          {item.children && (
            <button
              type="button"
              onClick={() => toggleItem(item.href)}
              aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
              aria-expanded={expanded}
              className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight
                className={`size-4 transition-transform duration-300 ease-in-out ${
                  expanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Animated submenu */}
        {item.children && (
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className={`ml-[21px] mt-1 space-y-1 border-l border-border/80 pl-3 transition-[opacity,transform] duration-200 ${
                  expanded
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0"
                }`}
                aria-hidden={!expanded}
              >
                {item.children.map((child) => {
                  const childActive = isRouteActive(pathname, child.href);

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      tabIndex={expanded ? 0 : -1}
                      aria-current={childActive ? "page" : undefined}
                      className={`flex min-h-9 items-center gap-2.5 rounded-md px-2.5 text-xs transition-colors duration-200 ${
                        childActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <FileSpreadsheet
                        className={`size-3.5 shrink-0 ${
                          childActive
                            ? "text-primary"
                            : "text-muted-foreground/70"
                        }`}
                      />

                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Brand */}
      <Link
        href="/"
        onClick={onNavigate}
        className="group flex h-16 shrink-0 items-center gap-3 border-b border-border/70 px-5"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
          <SiGithub className="size-[18px]" />
        </span>

        <span className="text-base font-semibold tracking-tight">
          MatchForge
        </span>

        <span className="ml-auto rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-wide text-muted-foreground">
          CORE
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {sections.map((section) => (
          <section key={section.title} className="mb-7 last:mb-2">
            <h2 className="mb-2.5 px-3 text-[10px] font-semibold tracking-[0.13em] text-muted-foreground/70">
              {section.title}
            </h2>

            <nav className="space-y-1">{section.links.map(renderItem)}</nav>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/70 p-3">
        <a
          href="https://github.com/Pavan-2929/MatchForge"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground transition-colors duration-200 hover:bg-muted/70 hover:text-foreground"
        >
          <SiGithub className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />

          <span>GitHub Repository</span>

          <span className="ml-auto text-muted-foreground/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
