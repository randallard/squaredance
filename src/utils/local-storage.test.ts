/**
 * Tests for localStorage utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearAllLocalStorage,
  isLocalStorageAvailable,
  STORAGE_KEYS,
} from './local-storage'

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage', () => {
      const data = { name: 'Test', value: 42 }
      saveToLocalStorage('test-key', data)

      const saved = localStorage.getItem('test-key')
      expect(saved).toBeTruthy()
      expect(JSON.parse(saved!)).toEqual(data)
    })

    it('should handle nested objects', () => {
      const data = {
        user: { name: 'Test' },
        stats: { count: 10 },
      }
      saveToLocalStorage('test-key', data)

      const saved = localStorage.getItem('test-key')
      expect(JSON.parse(saved!)).toEqual(data)
    })
  })

  describe('loadFromLocalStorage', () => {
    const schema = z.object({
      name: z.string(),
      value: z.number(),
    })

    it('should load and validate data from localStorage', () => {
      const data = { name: 'Test', value: 42 }
      localStorage.setItem('test-key', JSON.stringify(data))

      const loaded = loadFromLocalStorage('test-key', schema)
      expect(loaded).toEqual(data)
    })

    it('should return null if key does not exist', () => {
      const loaded = loadFromLocalStorage('non-existent', schema)
      expect(loaded).toBeNull()
    })

    it('should return null if validation fails', () => {
      const invalidData = { name: 'Test', value: 'not-a-number' }
      localStorage.setItem('test-key', JSON.stringify(invalidData))

      const loaded = loadFromLocalStorage('test-key', schema)
      expect(loaded).toBeNull()
    })

    it('should return null if JSON is malformed', () => {
      localStorage.setItem('test-key', 'not valid json')

      const loaded = loadFromLocalStorage('test-key', schema)
      expect(loaded).toBeNull()
    })
  })

  describe('removeFromLocalStorage', () => {
    it('should remove data from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBeTruthy()

      removeFromLocalStorage('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should not throw if key does not exist', () => {
      expect(() => removeFromLocalStorage('non-existent')).not.toThrow()
    })
  })

  describe('clearAllLocalStorage', () => {
    it('should clear all app-specific storage keys', () => {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, 'test1')
      localStorage.setItem('other-app-key', 'test2')

      clearAllLocalStorage()

      expect(localStorage.getItem(STORAGE_KEYS.USER_PROFILE)).toBeNull()
      // Other keys should remain
      expect(localStorage.getItem('other-app-key')).toBeTruthy()
    })
  })

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true)
    })
  })
})
