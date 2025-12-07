/**
 * Custom hook for managing localStorage with React state
 */

import { useState, useEffect, useCallback } from 'react'
import type { z } from 'zod'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/local-storage'

/**
 * Hook for syncing state with localStorage
 * @param key - localStorage key
 * @param schema - Zod schema for validation
 * @param defaultValue - Default value if nothing in localStorage
 */
export function useLocalStorage<T>(
  key: string,
  schema: z.ZodSchema<T>,
  defaultValue: T
): [T, (value: T) => void] {
  // Initialize state from localStorage or use default
  const [state, setState] = useState<T>(() => {
    const loaded = loadFromLocalStorage(key, schema)
    return loaded !== null ? loaded : defaultValue
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(key, state)
  }, [key, state])

  // Provide setter function
  const setValue = useCallback((value: T) => {
    setState(value)
  }, [])

  return [state, setValue]
}
