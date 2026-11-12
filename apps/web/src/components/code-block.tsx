"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-accent/60">
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <span className="text-[11px] font-medium text-muted-foreground">
          {language}
        </span>

        <button
          type="button"
          onClick={copyCode}
          aria-label={copied ? "Code copied" : "Copy code"}
          className={`relative inline-flex h-7 items-center gap-1.5 overflow-hidden rounded-md px-2 text-[11px] font-medium transition-colors duration-200 ${
            copied
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 5, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1.5"
              >
                <Check className="size-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: -5, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="size-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
