import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FREEMIUM_LIMIT = 3;
export const STORAGE_KEY = "skillpath_free_generations";
export const PDF_PAID_KEY = "skillpath_pdf_paid";

export function getGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function incrementGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  const count = getGenerationCount() + 1;
  localStorage.setItem(STORAGE_KEY, count.toString());
  return count;
}

export function hasReachedLimit(): boolean {
  return getGenerationCount() >= FREEMIUM_LIMIT;
}

export function isPdfPaid(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PDF_PAID_KEY) === "true";
}

export function setPdfPaid(_paid: boolean = true): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PDF_PAID_KEY, _paid ? "true" : "false");
}

export function getLemonSqueezyCheckoutUrl(): string {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PDF_CHECKOUT || "";
}