import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, AlertCircle, Clock, Eye } from "lucide-react";

export default function NotFound() {
  return (
    <div className="p-6 md:p-8">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-5xl md:text-6xl font-bold text-foreground">
              404
            </CardTitle>
          </div>
          <CardTitle className="text-xl md:text-2xl text-destructive">
            Paste Not Found
          </CardTitle>
          <CardDescription className="text-base">
            This paste doesn&apos;t exist, has expired, or has reached its view limit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Possible Reasons</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>The paste may have expired due to its time-to-live (TTL) setting.</span>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>The paste may have reached its maximum view limit.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>The paste may have been deleted or the link is incorrect.</span>
              </div>
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create New Paste
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
