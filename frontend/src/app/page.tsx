"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Check, Plus, Loader2, Info, AlertCircle } from "lucide-react";

type CreateResponse = {
  id: string;
  url: string;
};

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [result, setResult] = useState<CreateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSubmitting(true);

    try {
      // Client-side validation
      if (!content.trim()) {
        setError("Content is required. Please enter some text.");
        setSubmitting(false);
        return;
      }

      const body: Record<string, unknown> = {
        content: content.trim(),
      };
      
      // Validate TTL
      if (ttlSeconds.trim().length > 0) {
        const ttl = Number(ttlSeconds);
        if (isNaN(ttl) || !Number.isInteger(ttl) || ttl < 1) {
          setError("Time-to-Live must be a positive integer (e.g., 3600 for 1 hour).");
          setSubmitting(false);
          return;
        }
        body.ttl_seconds = ttl;
      }
      
      // Validate Max Views
      if (maxViews.trim().length > 0) {
        const max = Number(maxViews);
        if (isNaN(max) || !Number.isInteger(max) || max < 1) {
          setError("Max Views must be a positive integer (e.g., 10).");
          setSubmitting(false);
          return;
        }
        body.max_views = max;
      }

      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Failed to create paste");
        return;
      }

      const data = (await res.json()) as CreateResponse;
      setResult(data);
      // Keep form values filled so user can create another paste with same settings
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Paste</CardTitle>
          <CardDescription>
            Paste your content below and configure optional settings for TTL and view limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="content"
                className="min-h-[200px] font-mono"
                placeholder="Type or paste any text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                This text will be visible to anyone with the link
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ttl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Time-to-Live (seconds) <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </label>
                <Input
                  id="ttl"
                  type="number"
                  min={1}
                  placeholder="e.g. 3600 (1 hour)"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste expires after this many seconds
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxViews" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Max Views <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </label>
                <Input
                  id="maxViews"
                  type="number"
                  min={1}
                  placeholder="e.g. 10"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Number of views allowed before deletion
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={submitting || !content.trim()}
              className="w-full md:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Paste
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-900">Paste Created Successfully!</CardTitle>
            <CardDescription className="text-green-700">
              Share this link to let others view your paste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 rounded-md bg-white border border-green-200">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-primary hover:underline break-all font-mono"
              >
                {result.url}
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.url)}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
