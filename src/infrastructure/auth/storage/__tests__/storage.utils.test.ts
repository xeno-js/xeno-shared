import { afterEach, describe, expect, it, vi } from 'vitest'

import type { IStorage } from '@/domain'
import type { CookieOptions } from '@/shared'

import { StorageHelper } from '../storage.utils'

describe('StorageHelper', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should create an isolated memory storage', () => {
    const storage = StorageHelper.create({
      type: 'memory',
      storage: undefined,
      cookieOpts: undefined,
    })
    const otherStorage = StorageHelper.create({
      type: 'memory',
      storage: undefined,
      cookieOpts: undefined,
    })

    expect(storage).toBeDefined()
    storage?.setItem('key', 'value')
    expect(storage?.getItem('key')).toBe('value')
    expect(otherStorage?.getItem('key')).toBeNull()
    storage?.removeItem('key')
    expect(storage?.getItem('key')).toBeNull()
  })

  it('should return the configured storage for the default branch', () => {
    const storage: IStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }

    expect(StorageHelper.create({ type: undefined, storage, cookieOpts: undefined })).toBe(storage)
  })

  it('should return browser local and session storage', () => {
    const localStorage = { name: 'local' }
    const sessionStorage = { name: 'session' }
    vi.stubGlobal('localStorage', localStorage)
    vi.stubGlobal('sessionStorage', sessionStorage)

    expect(StorageHelper.create({ type: 'local', storage: undefined, cookieOpts: undefined })).toBe(
      localStorage,
    )
    expect(
      StorageHelper.create({ type: 'session', storage: undefined, cookieOpts: undefined }),
    ).toBe(sessionStorage)
  })

  it('should require cookie options for cookie storage', () => {
    expect(() =>
      StorageHelper.create({ type: 'cookie', storage: undefined, cookieOpts: undefined }),
    ).toThrow('At least ')
  })

  it('should create cookie storage when options are provided', () => {
    const cookieOpts: CookieOptions = { path: '/', secure: true }
    const storage = StorageHelper.create({ type: 'cookie', storage: undefined, cookieOpts })

    expect(storage).toBeDefined()
  })
})
