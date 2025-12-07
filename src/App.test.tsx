import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import type { UserProfile } from './types'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the welcome screen when no user profile exists', () => {
    render(<App />)
    expect(screen.getByText('Square Dance Caller Practice')).toBeDefined()
    expect(screen.getByText(/What's your name?/i)).toBeDefined()
  })

  it('renders welcome message for new users', () => {
    render(<App />)
    expect(
      screen.getByText(/This tool will help you develop your sight calling skills/i)
    ).toBeDefined()
  })

  it('renders main app with profile button when user exists', () => {
    const mockUser: UserProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'TestUser',
      createdAt: Date.now(),
      stats: {
        totalSessions: 0,
        totalCalls: 0,
        successfulSequences: 0,
        failedSequences: 0,
      },
    }

    localStorage.setItem('squaredance-user-profile', JSON.stringify(mockUser))

    render(<App />)

    expect(screen.getByText('Welcome back, TestUser!')).toBeDefined()
    expect(screen.getByRole('button', { name: /Open profile/i })).toBeDefined()
  })

  it('opens profile modal when profile button is clicked', async () => {
    const user = userEvent.setup()
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
    }

    localStorage.setItem('squaredance-user-profile', JSON.stringify(mockUser))

    render(<App />)

    const profileButton = screen.getByRole('button', { name: /Open profile/i })
    await user.click(profileButton)

    // Modal should be visible
    expect(screen.getByText('Profile')).toBeDefined()
    expect(screen.getByText('Statistics')).toBeDefined()
  })

  it('closes profile modal when close button is clicked', async () => {
    const user = userEvent.setup()
    const mockUser: UserProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'TestUser',
      createdAt: Date.now(),
      stats: {
        totalSessions: 0,
        totalCalls: 0,
        successfulSequences: 0,
        failedSequences: 0,
      },
    }

    localStorage.setItem('squaredance-user-profile', JSON.stringify(mockUser))

    render(<App />)

    // Open modal
    const profileButton = screen.getByRole('button', { name: /Open profile/i })
    await user.click(profileButton)

    expect(screen.getByText('Profile')).toBeDefined()

    // Close modal
    const closeButton = screen.getByLabelText(/Close profile modal/i)
    await user.click(closeButton)

    // Modal should be gone
    expect(screen.queryByText('Statistics')).toBeNull()
  })
})
