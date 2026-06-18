import { v4 as uuidv4 } from 'uuid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes intelligently.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID with an optional prefix.
 * Format: PREFIX_UUID8 (e.g., "TX_A3F8C2B1")
 */
export function generateId(prefix: string = 'ID'): string {
  const short = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}_${short}`;
}

/**
 * Get current Unix timestamp in seconds.
 */
export function now(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Simple hash for biometric signatures (not cryptographically secure —
 * use a proper hashing library in production).
 */
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `BIO_${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

/**
 * Deep clone an object (safe for serializable data).
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to a given number of decimal places.
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
