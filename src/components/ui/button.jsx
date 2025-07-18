/**
 * Generic, theme-aware button component used across the dashboard UI.
 *
 * The implementation is intentionally thin; it delegates styling concerns to
 *   1. `class-variance-authority` (CVA) – declarative variant definitions
 *   2. `tailwind-merge` (through the local `cn` util) – merge conflict rules
 *
 * Supported variants (see `buttonVariants` below):
 *   • variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
 *   • size:    "default" | "sm" | "lg" | "icon"
 *
 * Example
 * ```jsx
 * import { Button } from "../components/ui/button";
 *
 * <Button onClick={save} variant="secondary" size="sm">
 *   Save changes
 * </Button>
 * ```
 *
 * Because the component forwards its ref and spreads `...props`, it behaves
 * like a regular `<button>` element (or whatever is supplied via `asChild`).
 * That makes it compatible with React-Aria, Radix primitives, and standard
 * form behaviors out of the box.
 */
// ---------------------------------------------------------------------------
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// The heavy lifting is done by `buttonVariants` – a function produced by CVA
// that takes a prop map and returns an appropriate Tailwind class string. This
// keeps the runtime component extremely small.

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants } 