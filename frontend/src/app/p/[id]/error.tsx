"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Clock, Eye, AlertCircle } from "lucide-react";

export default function PasteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Paste error:", error);
  }, [error]);

  // Try to extract error reason from message
  const errorMessage = error.message || error.digest || "Unknown error";
  let title = "Error Loading Paste";
  let description = "An error occurred while loading the paste.";
  let icon = <AlertCircle className="h-5 w-5" />;

  if (errorMessage.includes("expired") || errorMessage.includes("TTL")) {
    title = "Paste Expired";
    description = "This paste has expired and is no longer available. Pastes with a time-to-live (TTL) setting are automatically deleted after the specified duration.";
    icon = <Clock className="h-5 w-5" />;
  } else if (errorMessage.includes("view") || errorMessage.includes("limit")) {
    title = "View Limit Reached";
    description = "This paste has reached its maximum view limit and is no longer available. The paste was automatically deleted after the specified number of views.";
    icon = <Eye className="h-5 w-5" />;
  } else if (errorMessage.includes("not found") || errorMessage.includes("404")) {
    title = "Paste Not Found";
    description = "This paste doesn't exist or may have been deleted. Please check the link and try again.";
    icon = <AlertCircle className="h-5 w-5" />;
  }

  return (
    <div className="p-6 md:p-8">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <CardTitle className="text-xl md:text-2xl text-destructive">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="font-mono text-xs">
              {errorMessage}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create New Paste
              </Button>
            </Link>
            <Button variant="outline" onClick={reset} className="flex-1">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

