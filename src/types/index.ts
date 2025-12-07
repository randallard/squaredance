/**
 * Core types for the Square Dance Caller Practice app
 */

/**
 * User profile data
 */
export interface UserProfile {
  id: string
  name: string
  createdAt: number
  stats: UserStats
  preferences?: UserPreferences
}

/**
 * User statistics tracking
 */
export interface UserStats {
  totalSessions: number
  totalCalls: number
  successfulSequences: number
  failedSequences: number
}

/**
 * User preferences
 */
export interface UserPreferences {
  autoPlayAnimations?: boolean
  showFlowHints?: boolean
}
