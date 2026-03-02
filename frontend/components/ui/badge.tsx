import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "destructive" | "secondary" | "outline" }) {
  const styles =
    variant === "success"
      ? "bg-success/10 text-success"
      : variant === "warning"
      ? "bg-warning/10 text-warning"
      : variant === "destructive"
      ? "bg-destructive/10 text-destructive"
      : variant === "secondary"
      ? "bg-primary/10 text-primary"
      : variant === "outline"
      ? "border border-border text-muted-foreground"
      : "bg-muted text-secondary";

  return <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", styles, className)} {...props} />;
}
