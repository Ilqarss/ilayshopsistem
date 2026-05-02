import * as React from "react";
import { cn } from "../../lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/25",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";