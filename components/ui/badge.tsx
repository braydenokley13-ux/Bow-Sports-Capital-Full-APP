import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/15 text-primary",
        secondary: "border-white/10 bg-white/5 text-white/80",
        outline: "border-white/15 text-white/80",
        success: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
        warning: "border-amber-400/30 bg-amber-400/15 text-amber-300",
        danger: "border-rose-400/30 bg-rose-400/15 text-rose-300",
        gold: "border-amber-400/40 bg-amber-400/10 text-amber-300",
        silver: "border-white/25 bg-white/10 text-white/90",
        bronze: "border-orange-800/40 bg-orange-900/20 text-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
