/**
 * WelcomeScreen - Initial screen for new users to enter name or restore backup
 */

import { useState, useCallback, useRef, type ReactElement, type FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { UserProfile } from '../types'
import { loadBackupFromFile, importBackup } from '../utils/backup'
import styles from './WelcomeScreen.module.css'

export interface WelcomeScreenProps {
  /** Callback when user profile is created */
  onCreateProfile: (user: UserProfile) => void
}

/**
 * Welcome screen for first-time users
 * Allows entering name or restoring from backup
 */
export function WelcomeScreen({ onCreateProfile }: WelcomeScreenProps): ReactElement {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [backupMessage, setBackupMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateName = useCallback((value: string): string | null => {
    if (value === '') {
      return 'Name is required'
    }

    if (value.length > 20) {
      return 'Name must be 20 characters or less'
    }

    const validCharPattern = /^[a-zA-Z0-9\s_-]+$/
    if (!validCharPattern.test(value)) {
      return 'Only letters, numbers, spaces, dash (-), and underscore (_) allowed'
    }

    if (value !== value.trim()) {
      return 'Name cannot start or end with spaces'
    }

    return null
  }, [])

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value
      setName(newValue)
      setIsDirty(true)

      const validationError = validateName(newValue)
      setError(validationError)
    },
    [validateName]
  )

  const handleSubmit = useCallback(
    (e: FormEvent): void => {
      e.preventDefault()

      const validationError = validateName(name)
      if (validationError) {
        setError(validationError)
        setIsDirty(true)
        return
      }

      const user: UserProfile = {
        id: uuidv4(),
        name: name.trim(),
        createdAt: Date.now(),
        stats: {
          totalSessions: 0,
          totalCalls: 0,
          successfulSequences: 0,
          failedSequences: 0,
        },
        preferences: {
          autoPlayAnimations: true,
          showFlowHints: true,
        },
      }

      onCreateProfile(user)
    },
    [name, validateName, onCreateProfile]
  )

  const handleRestoreClick = useCallback((): void => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        console.log('[WELCOME] Loading backup from file...')
        const backup = await loadBackupFromFile(file)
        if (!backup) {
          console.error('[WELCOME] Invalid backup file')
          setBackupMessage('Invalid backup file')
          setTimeout(() => setBackupMessage(null), 3000)
          return
        }

        console.log('[WELCOME] Backup loaded, showing confirmation...')
        const confirmed = window.confirm('This will restore your profile. Continue?')

        if (confirmed) {
          console.log('[WELCOME] User confirmed, importing backup...')
          const success = importBackup(backup)
          if (success) {
            console.log('[WELCOME] Import successful, reloading...')
            window.location.reload()
          } else {
            console.error('[WELCOME] Import failed')
            setBackupMessage('Failed to restore backup')
            setTimeout(() => setBackupMessage(null), 3000)
          }
        } else {
          console.log('[WELCOME] User cancelled restore')
        }
      } catch (error) {
        console.error('[WELCOME] Error during restore:', error)
        setBackupMessage('Error reading backup file')
        setTimeout(() => setBackupMessage(null), 3000)
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    []
  )

  const isValid = validateName(name) === null

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Square Dance Caller Practice</h1>
        <p className={styles.subtitle}>
          Welcome! This tool will help you develop your sight calling skills and choreography.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="user-name" className={styles.label}>
              What's your name?
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`${styles.input} ${isDirty && isValid ? styles.valid : ''} ${
                error ? styles.invalid : ''
              }`}
              placeholder="Enter your name"
              maxLength={20}
              autoComplete="off"
              autoFocus
              aria-invalid={isDirty && error !== null}
              aria-describedby={error ? 'name-error' : undefined}
            />
            {error && (
              <p id="name-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
            {!isDirty && (
              <p className={styles.helper}>
                1-20 characters: letters, numbers, spaces, dash, underscore
              </p>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={!isValid}>
            Get Started
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.restore}>
          <p className={styles.restoreText}>Already have a backup?</p>
          <button type="button" onClick={handleRestoreClick} className={styles.restoreButton}>
            📤 Restore from Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Upload backup file"
          />
          {backupMessage && <div className={styles.backupMessage}>{backupMessage}</div>}
        </div>
      </div>
    </div>
  )
}
