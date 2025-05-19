import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility for constructing className strings conditionally
 * Combines clsx for conditional classes with tailwind-merge to handle
 * Tailwind CSS class conflicts correctly
 * 
 * @param  {...any} inputs - Class names, objects, or arrays to be processed
 * @returns {string} - The merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 