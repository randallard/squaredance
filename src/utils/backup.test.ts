/**
 * Tests for backup utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { exportBackup, validateBackup, importBackup } from './backup'
import type { UserProfile } from '../types'

describe('backup utilities', () => {
  const mockUser: UserProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'TestUser',
    createdAt: Date.now(),
    stats: {
      totalSessions: 5,
      totalCalls: 100,
      successfulSequences: 80,
      failedSequences: 20,
    },
    preferences: {
      autoPlayAnimations: true,
      showFlowHints: false,
    },
  }

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('exportBackup', () => {
    it('should export backup with null user when localStorage is empty', () => {
      const backup = exportBackup()

      expect(backup.version).toBe('1.0.0')
      expect(backup.timestamp).toBeGreaterThan(0)
      expect(backup.user).toBeNull()
    })

    it('should export backup with user data when present', () => {
      localStorage.setItem('squaredance-user-profile', JSON.stringify(mockUser))

      const backup = exportBackup()

      expect(backup.version).toBe('1.0.0')
      expect(backup.timestamp).toBeGreaterThan(0)
      expect(backup.user).toEqual(mockUser)
    })
  })

  describe('validateBackup', () => {
    it('should validate correct backup data', () => {
      const validBackup = {
        version: '1.0.0',
        timestamp: Date.now(),
        user: mockUser,
      }

      const result = validateBackup(validBackup)

      expect(result).toEqual(validBackup)
    })

    it('should validate backup with null user', () => {
      const validBackup = {
        version: '1.0.0',
        timestamp: Date.now(),
        user: null,
      }

      const result = validateBackup(validBackup)

      expect(result).toEqual(validBackup)
    })

    it('should return null for invalid backup structure', () => {
      // Suppress expected console.error
      const consoleError = console.error
      console.error = () => {}

      const invalidBackup = {
        version: '1.0.0',
        // missing timestamp
      }

      const result = validateBackup(invalidBackup)

      expect(result).toBeNull()

      // Restore console.error
      console.error = consoleError
    })

    it('should return null for invalid user data', () => {
      // Suppress expected console.error
      const consoleError = console.error
      console.error = () => {}

      const invalidBackup = {
        version: '1.0.0',
        timestamp: Date.now(),
        user: {
          id: 'not-a-uuid',
          name: 'Test',
        },
      }

      const result = validateBackup(invalidBackup)

      expect(result).toBeNull()

      // Restore console.error
      console.error = consoleError
    })
  })

  describe('importBackup', () => {
    it('should import valid backup successfully', () => {
      const backup = {
        version: '1.0.0',
        timestamp: Date.now(),
        user: mockUser,
      }

      const result = importBackup(backup)

      expect(result).toBe(true)
      const saved = localStorage.getItem('squaredance-user-profile')
      expect(saved).toBeTruthy()
      expect(JSON.parse(saved!)).toEqual(mockUser)
    })

    it('should remove user when backup has null user', () => {
      // First set some user data
      localStorage.setItem('squaredance-user-profile', JSON.stringify(mockUser))

      const backup = {
        version: '1.0.0',
        timestamp: Date.now(),
        user: null,
      }

      const result = importBackup(backup)

      expect(result).toBe(true)
      expect(localStorage.getItem('squaredance-user-profile')).toBeNull()
    })

    it('should return false for invalid backup', () => {
      // Suppress expected console.error
      const consoleError = console.error
      console.error = () => {}

      const invalidBackup = {
        version: '1.0.0',
        // missing required fields
      }

      const result = importBackup(invalidBackup)

      expect(result).toBe(false)

      // Restore console.error
      console.error = consoleError
    })
  })
})
