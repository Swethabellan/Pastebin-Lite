import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getCurrentTimeMs } from "@/lib/time";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye, FileText, ArrowLeft } from "lucide-react";

type PastePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PastePage({ params }: PastePageProps) {
  const { id } = await params;

  const hdrs = await headers();
  const dummyReq = new Request("http://localhost", {
    headers: hdrs,
  });
  const nowMs = getCurrentTimeMs(dummyReq);

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    notFound();
  }

  const createdMs = paste.createdAt.getTime();

  // Check TTL expiration
  if (paste.ttlSeconds != null) {
    const expiresMs = createdMs + paste.ttlSeconds * 1000;
    if (nowMs >= expiresMs) {
      notFound();
    }
  }

  // Check view limit and decrement if applicable
  let displayRemainingViews: number | null = null;
  if (paste.maxViews != null) {
    let currentRemainingViews = paste.remainingViews;
    
    // If remainingViews is null but maxViews is set, initialize it to maxViews
    // This handles edge cases where data might be inconsistent
    if (currentRemainingViews === null) {
      currentRemainingViews = paste.maxViews;
      await prisma.paste.update({
        where: { id },
        data: { remainingViews: paste.maxViews },
      });
    }
    
    // Check if views are exhausted
    if (currentRemainingViews <= 0) {
      notFound();
    }
    
    // Decrement the view count
    const nextRemaining = currentRemainingViews - 1;
    await prisma.paste.update({
      where: { id },
      data: { remainingViews: nextRemaining },
    });
    
    displayRemainingViews = nextRemaining;
  }

  const timeAgo = Math.floor((Date.now() - createdMs) / 1000);
  const minutesAgo = Math.floor(timeAgo / 60);
  const hoursAgo = Math.floor(timeAgo / 3600);
  const daysAgo = Math.floor(timeAgo / 86400);

  let timeString = "just now";
  if (daysAgo > 0) timeString = `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  else if (hoursAgo > 0) timeString = `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  else if (minutesAgo > 0) timeString = `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">View Paste</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Created {timeString}
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Create New Paste
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Content</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {displayRemainingViews !== null && (
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  {displayRemainingViews} view{displayRemainingViews !== 1 ? "s" : ""} remaining
                </span>
              )}
              {paste.ttlSeconds !== null && (() => {
                const expiresMs = paste.createdAt.getTime() + paste.ttlSeconds * 1000;
                const remainingMs = Math.max(0, expiresMs - Date.now());
                const remainingMinutes = Math.floor(remainingMs / 1000 / 60);
                return (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Expires in {remainingMinutes} min
                  </span>
                );
              })()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="whitespace-pre-wrap break-words text-sm p-6 font-mono leading-relaxed overflow-x-auto bg-muted/30">
            {paste.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
