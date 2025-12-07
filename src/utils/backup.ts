/**
 * Backup and restore utilities for localStorage data
 */

import { UserProfileSchema } from '../schemas'
import type { UserProfile } from '../types'
import { z } from 'zod'

/**
 * Backup data structure
 */
export interface BackupData {
  version: string
  timestamp: number
  user: UserProfile | null
}

/**
 * Backup data schema for validation
 */
const BackupDataSchema = z.object({
  version: z.string(),
  timestamp: z.number(),
  user: UserProfileSchema.nullable(),
})

/**
 * Export localStorage data as JSON backup
 */
export function exportBackup(): BackupData {
  const userJson = localStorage.getItem('squaredance-user-profile')
  const user = userJson ? JSON.parse(userJson) : null

  return {
    version: '1.0.0',
    timestamp: Date.now(),
    user,
  }
}

/**
 * Download backup data as JSON file
 */
export function downloadBackup(): void {
  const backup = exportBackup()
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const timestamp = new Date(backup.timestamp).toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const filename = `squaredance-backup-${timestamp}.json`

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Validate and parse backup data
 */
export function validateBackup(data: unknown): BackupData | null {
  try {
    return BackupDataSchema.parse(data)
  } catch (error) {
    console.error('Invalid backup data:', error)
    return null
  }
}

/**
 * Import backup data and restore to localStorage
 * @returns true if successful, false if validation failed
 */
export function importBackup(data: unknown): boolean {
  console.log('[BACKUP] Starting import...')
  const backup = validateBackup(data)
  if (!backup) {
    console.error('[BACKUP] Validation failed')
    return false
  }

  console.log('[BACKUP] Backup validated:', {
    userName: backup.user?.name,
  })

  try {
    // Validate user data before importing
    if (backup.user) {
      const validUser = UserProfileSchema.parse(backup.user)
      console.log('[BACKUP] Saving user to localStorage:', validUser.name)
      localStorage.setItem('squaredance-user-profile', JSON.stringify(validUser))
      console.log(
        '[BACKUP] Verify saved:',
        JSON.parse(localStorage.getItem('squaredance-user-profile')!).name
      )
    } else {
      console.log('[BACKUP] Removing user from localStorage')
      localStorage.removeItem('squaredance-user-profile')
    }

    console.log('[BACKUP] Import complete, ready to reload')
    return true
  } catch (error) {
    console.error('[BACKUP] Failed to import backup:', error)
    return false
  }
}

/**
 * Load backup from file
 */
export async function loadBackupFromFile(file: File): Promise<BackupData | null> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    return validateBackup(data)
  } catch (error) {
    console.error('Failed to read backup file:', error)
    return null
  }
}
