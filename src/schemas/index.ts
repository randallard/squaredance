/**
 * Zod schemas for runtime validation
 */

import { z } from 'zod'

/**
 * User statistics schema
 */
export const UserStatsSchema = z.object({
  totalSessions: z.number().int().min(0),
  totalCalls: z.number().int().min(0),
  successfulSequences: z.number().int().min(0),
  failedSequences: z.number().int().min(0),
})

/**
 * User preferences schema
 */
export const UserPreferencesSchema = z.object({
  autoPlayAnimations: z.boolean().optional(),
  showFlowHints: z.boolean().optional(),
})

/**
 * User profile schema
 */
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
  createdAt: z.number().int().positive(),
  stats: UserStatsSchema,
  preferences: UserPreferencesSchema.optional(),
})
