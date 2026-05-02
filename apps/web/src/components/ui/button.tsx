import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white shadow-[0_16px_40px_rgba(15,35,72,0.18)] hover:-translate-y-0.5 hover:bg-[var(--primary-strong)]",
        secondary: "bg-white/70 text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-white",
        accent: "bg-[var(--accent)] text-[var(--navy-950)] hover:bg-[var(--accent-strong)]",
        outline: "border border-[var(--border)] bg-white/70 text-[var(--foreground)] hover:bg-[var(--soft-navy)]/30 hover:border-[var(--primary)]",
        ghost: "text-[var(--muted-foreground)] hover:bg-[var(--soft-navy)]/60 hover:text-[var(--foreground)]",
        destructive: "bg-[#b93832] text-white hover:bg-[#9d2f2b]"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };