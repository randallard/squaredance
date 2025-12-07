import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Mock localStorage for happy-dom
class LocalStorageMock {
  private store: Record<string, string> = {}

  getItem(key: string): string | null {
    return this.store[key] ?? null
  }

  setItem(key: string, value: string): void {
    this.store[key] = value
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }

  get length(): number {
    return Object.keys(this.store).length
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] ?? null
  }
}

// Set up localStorage mock
global.localStorage = new LocalStorageMock() as Storage

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear()
})
