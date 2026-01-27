import { z } from 'zod';

const phoneRegex = /^\+\d{2}\s\d{10}$/;
const phoneMessage = 'Invalid phone format. Protocol: +CC XXXXXXXXXX (e.g. +91 9876543210)';

export const createSocietySchema = z.object({
  body: z.object({
    society: z.object({
      name: z.string().min(3, 'Society name must be at least 3 characters'),
      code: z
        .string()
        .min(2, 'Code must be at least 2 characters')
        .max(50, 'Code must be at most 50 characters')
        .regex(
          /^[A-Z0-9_-]+$/i,
          'Code can only contain letters, numbers, hyphens, and underscores'
        ),
      address: z.string().min(10, 'Address must be at least 10 characters'),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      country: z.string().default('India'),
      zipCode: z.string().min(4, 'ZIP code is required'),
      email: z.preprocess(
        (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
        z.string().email('Invalid email').optional()
      ),
      phone: z.preprocess(
        (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
        z.string().regex(phoneRegex, phoneMessage).optional()
      ),
      totalFlats: z.number().int().min(0).default(0),
    }),
    admin: z.object({
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      email: z.string().email('Invalid admin email'),
      phoneNumber: z.string().regex(phoneRegex, phoneMessage),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
  }),
});

export const updateSocietySchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    address: z.string().min(10).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    country: z.string().optional(),
    zipCode: z.string().min(4).optional(),
    email: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().email('Invalid email').optional()
    ),
    phone: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().regex(phoneRegex, phoneMessage).optional()
    ),
    totalFlats: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const societyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid society ID'),
  }),
});

export type CreateSocietyInput = z.infer<typeof createSocietySchema>['body'];
export type UpdateSocietyInput = z.infer<typeof updateSocietySchema>['body'];
