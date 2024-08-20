import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the image ID from the mint URL
 * @param {string} url - Mint URL
 * @returns {string} Extracted image ID
 */
export const extractImageId = (url: string): string => {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  return lastPart.split('.')[0]
}
