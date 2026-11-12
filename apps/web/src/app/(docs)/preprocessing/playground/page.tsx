"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { normalizeString, type NormalizeOptions } from "@matchforge/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const transformations: {
  key: keyof NormalizeOptions;
  label: string;
  description: string;
}[] = [
  {
    key: "lowercase",
    label: "Lowercase",
    description: "Convert all letters to lowercase.",
  },
  {
    key: "trim",
    label: "Trim whitespace",
    description: "Remove leading and trailing spaces.",
  },
  {
    key: "normalizeWhitespace",
    label: "Normalize whitespace",
    description: "Replace repeated spaces with one.",
  },
  {
    key: "removePunctuation",
    label: "Remove punctuation",
    description: "Remove punctuation characters.",
  },
  {
    key: "removeAccents",
    label: "Remove accents",
    description: "Convert accented letters to basic forms.",
  },
];

const initialOptions: NormalizeOptions = {
  lowercase: true,
  trim: true,
  normalizeWhitespace: true,
  removePunctuation: false,
  removeAccents: false,
};

const initialText = "  Jöhn   Smith, Jr.  ";

export default function PreprocessingPage() {
  const [input, setInput] = useState(initialText);
  const [settings, setSettings] = useState<NormalizeOptions>(initialOptions);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => normalizeString(input, settings),
    [input, settings],
  );

  const activeCount = transformations.filter(
    (item) => settings[item.key],
  ).length;

  const updateOption = (key: keyof NormalizeOptions, checked: boolean) => {
    setSettings((current) => ({
      ...current,
      [key]: checked,
    }));
  };

  const reset = () => {
    setInput(initialText);
    setSettings(initialOptions);
    setCopied(false);
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-7">
      <Link
        href="/preprocessing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Preprocessing Docs
      </Link>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Text preprocessing
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Standardize text with simple transformations. Edit the input, choose
            your options, and inspect the output instantly.
          </p>
        </div>

        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Reset
        </Button>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Text workspace</h2>
          <span className="text-xs text-muted-foreground">Live preview</span>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-2">
          <Card className="flex min-w-0 flex-col gap-0 overflow-hidden">
            <CardHeader className="border-b border-border py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Original text</CardTitle>
                <span className="text-xs text-muted-foreground">Input</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-4">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type or paste your text here..."
                className="min-h-48 flex-1 resize-y border-0 bg-transparent p-0 text-sm leading-7 shadow-none focus-visible:ring-0"
              />
            </CardContent>

            <CardFooter className="h-10 justify-between border-t border-border px-4 py-0">
              <span className="text-xs text-muted-foreground">Original</span>
              <span className="text-xs text-muted-foreground">
                {input.length} characters
              </span>
            </CardFooter>
          </Card>

          <Card className="flex min-w-0 flex-col gap-0 overflow-hidden">
            <CardHeader className="border-b border-border py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Processed text</CardTitle>
                <span className="text-xs text-muted-foreground">Output</span>
              </div>
            </CardHeader>

            <CardContent className="min-h-48 flex-1 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7">
                {output || (
                  <span className="text-muted-foreground">
                    Processed text will appear here.
                  </span>
                )}
              </p>
            </CardContent>

            <CardFooter className="h-10 justify-between border-t border-border px-4 py-0">
              <span className="text-xs text-muted-foreground">
                {output.length} characters
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={copyOutput}
                disabled={!output}
                className="h-8 px-2 text-xs"
              >
                {copied ? <Check /> : <Copy />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold">Transformations</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the operations to apply to your text.
            </p>
          </div>

          <span className="text-xs tabular-nums text-muted-foreground">
            {activeCount} of {transformations.length} enabled
          </span>
        </div>

        <Card className="gap-0 py-0">
          {transformations.map((item, index) => (
            <div key={item.key}>
              <div className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <Switch
                  checked={Boolean(settings[item.key])}
                  onCheckedChange={(checked) => updateOption(item.key, checked)}
                  aria-label={item.label}
                />
              </div>

              {index !== transformations.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      </section>

      <Card className="gap-0 py-4">
        <CardContent className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Ready for matching</p>
              <CardDescription className="mt-1">
                Use the processed output in String Comparison or Record
                Matching.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{input.length} characters</span>
            <ArrowDown className="size-3.5" />
            <span>{output.length} characters</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
