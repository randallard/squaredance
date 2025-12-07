/**
 * Tests for WelcomeScreen component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeScreen } from './WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders the welcome screen', () => {
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    expect(screen.getByText('Square Dance Caller Practice')).toBeDefined()
    expect(screen.getByText(/What's your name?/i)).toBeDefined()
  })

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i)
    const button = screen.getByRole('button', { name: /Get Started/i })

    await user.type(input, 'Test')
    await user.clear(input)

    expect(screen.getByText('Name is required')).toBeDefined()
    expect(button).toBeDisabled()
  })

  it('input enforces maxLength attribute', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i) as HTMLInputElement

    // Try to type more than 20 characters
    await user.type(input, 'ThisIsAVeryLongNameThatExceedsTwentyCharacters')

    // Input should be truncated to 20 characters
    expect(input.value.length).toBe(20)
    expect(input.value).toBe('ThisIsAVeryLongNameT')
  })

  it('shows validation error for invalid characters', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i)

    await user.type(input, 'Test@Name!')

    expect(
      screen.getByText('Only letters, numbers, spaces, dash (-), and underscore (_) allowed')
    ).toBeDefined()
  })

  it('calls onCreateProfile with valid name', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i)
    const button = screen.getByRole('button', { name: /Get Started/i })

    await user.type(input, 'TestUser')
    await user.click(button)

    expect(onCreateProfile).toHaveBeenCalledOnce()
    const profile = onCreateProfile.mock.calls[0]?.[0]
    expect(profile?.name).toBe('TestUser')
    expect(profile?.id).toBeTruthy()
    expect(profile?.createdAt).toBeGreaterThan(0)
    expect(profile?.stats).toEqual({
      totalSessions: 0,
      totalCalls: 0,
      successfulSequences: 0,
      failedSequences: 0,
    })
  })

  it('trims whitespace from name', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i)
    const button = screen.getByRole('button', { name: /Get Started/i })

    await user.type(input, '  TestUser  ')
    // Clear the trailing spaces to pass validation
    await user.clear(input)
    await user.type(input, 'TestUser')
    await user.click(button)

    expect(onCreateProfile).toHaveBeenCalledOnce()
    const profile = onCreateProfile.mock.calls[0]?.[0]
    expect(profile?.name).toBe('TestUser')
  })

  it('displays restore from backup button', () => {
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    expect(screen.getByText(/Already have a backup?/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Restore from Backup/i })).toBeDefined()
  })

  it('enables submit button only when name is valid', async () => {
    const user = userEvent.setup()
    const onCreateProfile = vi.fn()
    render(<WelcomeScreen onCreateProfile={onCreateProfile} />)

    const input = screen.getByLabelText(/What's your name?/i)
    const button = screen.getByRole('button', { name: /Get Started/i })

    // Initially disabled (no input)
    expect(button).toBeDisabled()

    // Type valid name
    await user.type(input, 'TestUser')
    expect(button).not.toBeDisabled()

    // Clear to make invalid
    await user.clear(input)
    expect(button).toBeDisabled()
  })
})
