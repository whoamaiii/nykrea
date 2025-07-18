import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Safely compose Tailwind CSS class names.
 *
 * This tiny wrapper combines the power of `clsx` (conditional class name
 * resolution) with `tailwind-merge` (conflict resolution for Tailwind
 * utilities). It lets you write expressive, conditional styling logic without
 * worrying about duplicate or conflicting classes — the last declaration wins
 * just like regular CSS.
 *
 * Example:
 * ```jsx
 * <button
 *   className={cn(
 *     "px-4 py-2 font-semibold",
 *     isActive && "bg-blue-600 text-white",
 *     size === "sm" && "text-xs px-2 py-1"
 *   )}
 * />
 * ```
 * The call above will collapse duplicate padding utilities and emit a clean
 * class string that can be passed directly to the `className` prop.
 *
 * @param {...import("clsx").ClassValue} inputs - Any value(s) accepted by
 *   `clsx` (strings, objects, arrays, etc.). They are evaluated left-to-right.
 * @returns {string} A single, space-separated string of class names with
 *   Tailwind conflicts resolved.
 */
export function cn(...inputs) {
  // `clsx` turns the variadic input into a single class string then
  // `tailwind-merge` removes duplicate/conflicting utilities (e.g. `p-2 p-4`).
  return twMerge(clsx(inputs))
} 