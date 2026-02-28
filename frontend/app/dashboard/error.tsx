"use client";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="rounded-lg border border-border p-8 text-center">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-secondary mb-4">Please try again. If the problem persists, contact support.</p>
      <Button onClick={() => reset()}>Retry</Button>
    </div>
  );
}
