/**
 * Tests for ProfileModal component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileModal } from './ProfileModal'
import type { UserProfile } from '../types'

describe('ProfileModal', () => {
  const mockUser: UserProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'TestUser',
    createdAt: Date.now(),
    stats: {
      totalSessions: 10,
      totalCalls: 250,
      successfulSequences: 200,
      failedSequences: 50,
    },
    preferences: {
      autoPlayAnimations: true,
      showFlowHints: false,
    },
  }

  it('renders profile modal with user data', () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    expect(screen.getByText('Profile')).toBeDefined()
    expect(screen.getByDisplayValue('TestUser')).toBeDefined()
    expect(screen.getByText('10')).toBeDefined() // Total Sessions
    expect(screen.getByText('250')).toBeDefined() // Total Calls
    expect(screen.getByText('200')).toBeDefined() // Successful
    expect(screen.getByText('50')).toBeDefined() // Failed
  })

  it('displays all stats correctly', () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    expect(screen.getByText('Total Sessions')).toBeDefined()
    expect(screen.getByText('Total Calls')).toBeDefined()
    expect(screen.getByText('Successful')).toBeDefined()
    expect(screen.getByText('Failed')).toBeDefined()
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const closeButton = screen.getByLabelText(/Close profile modal/i)
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    const { container } = render(
      <ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />
    )

    const backdrop = container.querySelector('[role="dialog"]')
    expect(backdrop).toBeTruthy()

    await user.click(backdrop!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    // Click on the form (modal content)
    const nameInput = screen.getByLabelText(/Name/i)
    await user.click(nameInput)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('allows editing name', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const nameInput = screen.getByLabelText(/Name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'NewName')

    expect(screen.getByDisplayValue('NewName')).toBeDefined()
  })

  it('shows validation error for invalid name', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const nameInput = screen.getByLabelText(/Name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Invalid@Name!')

    expect(
      screen.getByText('Only letters, numbers, spaces, dash (-), and underscore (_) allowed')
    ).toBeDefined()
  })

  it('disables save button when name is invalid', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const nameInput = screen.getByLabelText(/Name/i)
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })

    await user.clear(nameInput)

    expect(saveButton).toBeDisabled()
  })

  it('disables save button when no changes made', () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    expect(saveButton).toBeDisabled()
  })

  it('enables save button when valid changes are made', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const nameInput = screen.getByLabelText(/Name/i)
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })

    await user.clear(nameInput)
    await user.type(nameInput, 'NewValidName')

    expect(saveButton).not.toBeDisabled()
  })

  it('calls onUpdate with new name when saved', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const nameInput = screen.getByLabelText(/Name/i)
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })

    await user.clear(nameInput)
    await user.type(nameInput, 'UpdatedName')
    await user.click(saveButton)

    expect(onUpdate).toHaveBeenCalledOnce()
    const updatedUser = onUpdate.mock.calls[0]?.[0]
    expect(updatedUser?.name).toBe('UpdatedName')
    expect(updatedUser?.id).toBe(mockUser.id)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalledOnce()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('displays backup section', () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    render(<ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />)

    expect(screen.getByText('Data Backup')).toBeDefined()
    expect(screen.getByText(/Download your data as JSON/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Download Backup/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Restore Backup/i })).toBeDefined()
  })

  it('has proper accessibility attributes', () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()

    const { container } = render(
      <ProfileModal user={mockUser} onUpdate={onUpdate} onClose={onClose} />
    )

    const backdrop = container.querySelector('[role="dialog"]')
    expect(backdrop).toBeTruthy()
    expect(backdrop?.getAttribute('aria-modal')).toBe('true')
  })
})
