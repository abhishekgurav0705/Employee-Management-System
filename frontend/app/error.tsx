"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("GlobalError:", error);
  }, [error]);
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-lg font-semibold">Something went wrong</CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-secondary">An unexpected error occurred. Please try again.</p>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>Reload</Button>
            <Button variant="outline" onClick={() => window.location.assign("/")}>Go to Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
