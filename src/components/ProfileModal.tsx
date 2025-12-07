/**
 * ProfileModal - Modal for viewing/editing user profile
 */

import { useState, useCallback, useRef, type ReactElement, type FormEvent } from 'react'
import type { UserProfile } from '../types'
import { downloadBackup, loadBackupFromFile, importBackup } from '../utils/backup'
import styles from './ProfileModal.module.css'

export interface ProfileModalProps {
  /** Current user profile */
  user: UserProfile
  /** Callback when profile is updated */
  onUpdate: (user: UserProfile) => void
  /** Callback when modal should close */
  onClose: () => void
}

/**
 * Profile modal for editing user information
 *
 * Features:
 * - View user stats
 * - Edit name
 * - Download/restore backups
 * - Cancel to close without saving
 */
export function ProfileModal({ user, onUpdate, onClose }: ProfileModalProps): ReactElement {
  const [name, setName] = useState(user.name)
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

  const handleSave = useCallback(
    (e: FormEvent): void => {
      e.preventDefault()

      const validationError = validateName(name)
      if (validationError) {
        setError(validationError)
        return
      }

      onUpdate({
        ...user,
        name: name.trim(),
      })

      onClose()
    },
    [name, user, validateName, onUpdate, onClose]
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  const handleDownloadBackup = useCallback((): void => {
    try {
      downloadBackup()
      setBackupMessage('Backup downloaded successfully!')
      setTimeout(() => setBackupMessage(null), 3000)
    } catch {
      setBackupMessage('Failed to download backup')
      setTimeout(() => setBackupMessage(null), 3000)
    }
  }, [])

  const handleImportClick = useCallback((): void => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        console.log('[MODAL] Loading backup from file...')
        const backup = await loadBackupFromFile(file)
        if (!backup) {
          console.error('[MODAL] Invalid backup file')
          setBackupMessage('Invalid backup file')
          setTimeout(() => setBackupMessage(null), 3000)
          return
        }

        console.log('[MODAL] Backup loaded, showing confirmation...')
        const confirmed = window.confirm('This will replace your current profile data. Continue?')

        if (confirmed) {
          console.log('[MODAL] User confirmed, importing backup...')
          const success = importBackup(backup)
          if (success) {
            console.log('[MODAL] Import successful, reloading...')
            window.location.reload()
          } else {
            console.error('[MODAL] Import failed')
            setBackupMessage('Failed to restore backup')
            setTimeout(() => setBackupMessage(null), 3000)
          }
        } else {
          console.log('[MODAL] User cancelled restore')
        }
      } catch (error) {
        console.error('[MODAL] Error during restore:', error)
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
  const hasChanges = name.trim() !== user.name

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Profile</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close profile modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          {/* Name Input */}
          <div className={styles.field}>
            <label htmlFor="profile-name" className={styles.label}>
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`${styles.input} ${isDirty && isValid ? styles.valid : ''} ${
                error ? styles.invalid : ''
              }`}
              placeholder="Enter your name"
              maxLength={20}
              autoComplete="off"
            />
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Stats Display */}
          <div className={styles.stats}>
            <h3 className={styles.statsTitle}>Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Sessions</span>
                <span className={styles.statValue}>{user.stats.totalSessions}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Calls</span>
                <span className={styles.statValue}>{user.stats.totalCalls}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Successful</span>
                <span className={styles.statValue}>{user.stats.successfulSequences}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Failed</span>
                <span className={styles.statValue}>{user.stats.failedSequences}</span>
              </div>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className={styles.backup}>
            <h3 className={styles.backupTitle}>Data Backup</h3>
            <p className={styles.backupDescription}>
              Download your data as JSON or restore from a backup file
            </p>
            <div className={styles.backupActions}>
              <button type="button" onClick={handleDownloadBackup} className={styles.backupButton}>
                📥 Download Backup
              </button>
              <button type="button" onClick={handleImportClick} className={styles.backupButton}>
                📤 Restore Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                aria-label="Upload backup file"
              />
            </div>
            {backupMessage && <div className={styles.backupMessage}>{backupMessage}</div>}
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={!isValid || !hasChanges}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
