import { useCallback, useState } from 'react'
import { WelcomeScreen, ProfileModal } from './components'
import { useLocalStorage } from './hooks/useLocalStorage'
import { UserProfileSchema } from './schemas'
import type { UserProfile } from './types'
import { STORAGE_KEYS } from './utils/local-storage'
import './App.css'

function App() {
  const [savedUser, setSavedUser] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.USER_PROFILE,
    UserProfileSchema.nullable(),
    null
  )
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleCreateProfile = useCallback(
    (user: UserProfile) => {
      setSavedUser(user)
    },
    [setSavedUser]
  )

  const handleUpdateProfile = useCallback(
    (user: UserProfile) => {
      setSavedUser(user)
    },
    [setSavedUser]
  )

  const handleOpenProfile = useCallback(() => {
    setShowProfileModal(true)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setShowProfileModal(false)
  }, [])

  // Show welcome screen if no user profile exists
  if (!savedUser) {
    return <WelcomeScreen onCreateProfile={handleCreateProfile} />
  }

  // Main app screen
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome back, {savedUser.name}!</h1>
        <button onClick={handleOpenProfile} className="profile-button" aria-label="Open profile">
          👤 Profile
        </button>
      </header>
      <p className="welcome">Let's practice some square dance calling.</p>

      {showProfileModal && (
        <ProfileModal
          user={savedUser}
          onUpdate={handleUpdateProfile}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  )
}

export default App
