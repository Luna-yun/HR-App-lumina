import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        outline: "border border-border bg-transparent hover:bg-muted/50 text-foreground active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-muted/60 hover:text-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Premium hero button - substantial & confident
        hero: `bg-primary text-primary-foreground font-semibold
          shadow-[0_2px_12px_hsl(var(--primary)/0.25)] 
          hover:shadow-[0_8px_24px_hsl(var(--primary)/0.3)]
          hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98]`,
        
        // Hero outline - elegant secondary
        heroOutline: `border-[1.5px] border-foreground/15 bg-transparent text-foreground font-semibold
          hover:border-primary/40 hover:bg-primary/5 hover:text-primary
          hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98]`,
        
        // Dark section primary button
        heroDark: `bg-white text-primary font-semibold
          shadow-[0_2px_16px_rgba(255,255,255,0.2)]
          hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]
          hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98]`,
        
        // Dark section outline
        heroDarkOutline: `border-[1.5px] border-white/25 bg-transparent text-white font-semibold
          hover:bg-white/10 hover:border-white/40
          hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98]`,
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
