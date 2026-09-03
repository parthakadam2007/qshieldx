// OOP: Encapsulation — This utility module encapsulates class name merging logic for UI components.
// OOP: Abstraction — Provides a simple reusable function to compose class names without exposing library details.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
