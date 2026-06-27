import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium",
    "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
    "disabled:cursor-not-allowed disabled:opacity-40",
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent-hover active:bg-accent-pressed",
        secondary:
          "border border-border bg-transparent text-text hover:border-border-strong hover:bg-hover-surface",
        ghost:
          "bg-transparent text-text-2 hover:bg-hover-surface hover:text-text",
      },
      size: {
        md: "h-9 text-[14px]",
        touch: "h-11 text-[14px]",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: false, variant: "ghost", class: "px-3" },
      { iconOnly: false, variant: ["primary", "secondary"], class: "px-4" },
      { iconOnly: true, size: "md", class: "size-9 px-0" },
      { iconOnly: true, size: "touch", class: "size-11 px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
  };

export function Button({
  className,
  variant,
  size,
  iconOnly,
  asChild = false,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, iconOnly }),
        loading && "opacity-70",
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden
            strokeWidth={1.5}
          />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { buttonVariants };
