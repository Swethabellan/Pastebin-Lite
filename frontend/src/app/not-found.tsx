import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function NotFound() {
  return (
    <div className="p-6 md:p-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-5xl md:text-6xl font-bold text-foreground mb-2">
            404
          </CardTitle>
          <CardTitle className="text-xl md:text-2xl">
            Paste Not Found
          </CardTitle>
          <CardDescription className="text-base">
            This paste doesn&apos;t exist, has expired, or has reached its view limit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Paste
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
