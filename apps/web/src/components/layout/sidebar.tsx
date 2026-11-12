"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  Database,
  GitCompareArrows,
  ScanText,
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
    ],
  },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <SiGithub className="size-4" />
        </span>

        <span className="text-base font-semibold tracking-tight">
          MatchForge
        </span>

        <span className="ml-auto rounded-md border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          CORE
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-7">
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
              {section.title}
            </p>

            <nav className="space-y-1">
              {section.links.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors ${
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <a
          href="https://github.com/Pavan-2929/MatchForge"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <SiGithub className="size-4" />
          GitHub repository
          <span className="ml-auto">↗</span>
        </a>
      </div>
    </div>
  );
}
