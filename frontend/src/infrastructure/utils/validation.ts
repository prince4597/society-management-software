import { z } from 'zod';

/**
 * Shared regular expressions for consistent data patterns
 */
export const REGEX = {
  // Pattern: +CC XXXXXXXXXX (e.g., +91 9876543210)
  PHONE: /^\+\d{2}\s\d{10}$/,

  // Pattern: Alphanumeric with hyphens/underscores
  CODE: /^[A-Z0-9_-]+$/i,
};

/**
 * Shared Zod Schema Fragments
 */
export const VALIDATION = {
  PHONE: z.string().trim().regex(REGEX.PHONE, 'Format: +CC XXXXXXXXXX (e.g. +91 9876543210)'),
  PHONE_OPTIONAL: z
    .string()
    .trim()
    .regex(REGEX.PHONE, 'Format: +CC XXXXXXXXXX (e.g. +91 9876543210)')
    .or(z.literal(''))
    .optional(),

  EMAIL: z.string().trim().email('Invalid email address'),
  EMAIL_OPTIONAL: z.string().trim().email('Invalid email address').or(z.literal('')).optional(),

  NAME_MIN: (min: number = 2) => z.string().trim().min(min, `Must be at least ${min} characters`),
};
