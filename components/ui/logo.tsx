import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const logoVariants = cva("", {
  variants: {
    variant: {
      light: "text-white",
      dark: "text-dark",
      secondary: "text-secondary",
      primary: "text-primary",
      dynamic: "text-foreground",
    },
    size: {
      default: "w-8 h-8",
      sm: "w-6 h-6",
      lg: "w-12 h-12",
    },
  },
  defaultVariants: {
    variant: "dark",
    size: "default",
  },
});

export interface LogoProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof logoVariants> {
  asChild?: boolean;
}

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(logoVariants({ variant, size, className }))}
        width="320"
        height="320"
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 96.0748C60 75.4446 87.4454 68.3228 97.4765 86.35L199.96 270.525C207.378 283.856 197.739 300.25 182.483 300.25H80C68.9543 300.25 60 291.296 60 280.25L60 96.0748Z"
          fill="currentColor"
        />
        <circle cx="195.5" cy="107" r="64.5" fill="currentColor" />
      </svg>
    );
  },
);

Logo.displayName = "Logo";

export { Logo, logoVariants };
