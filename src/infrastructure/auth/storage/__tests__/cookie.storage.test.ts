import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CookieOptions } from '@/shared'

import { createCookieStorage } from '../cookie.storage'

describe('createCookieStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should read, write and remove encoded cookies with all options', () => {
    const documentMock = { cookie: 'existing%20key=existing%20value; other=value' }
    vi.stubGlobal('document', documentMock)
    const options: CookieOptions = {
      path: '/app',
      maxAge: 3600,
      domain: 'example.test',
      secure: true,
      sameSite: 'strict',
    }
    const storage = createCookieStorage(options)

    expect(storage.getItem('existing key')).toBe('existing value')
    expect(storage.getItem('missing')).toBeNull()

    storage.setItem('new key', 'new value')
    expect(documentMock.cookie).toBe(
      'new%20key=new%20value; path=/app; max-age=3600; domain=example.test; Secure; SameSite=strict',
    )

    storage.removeItem('new key')
    expect(documentMock.cookie).toBe('new%20key=; path=/app; expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('should use the root path when removing without a configured path', () => {
    const documentMock = { cookie: '' }
    vi.stubGlobal('document', documentMock)
    const storage = createCookieStorage({})

    storage.removeItem('key')

    expect(documentMock.cookie).toBe('key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('should no-op when document is unavailable', () => {
    vi.stubGlobal('document', undefined)
    const storage = createCookieStorage({})

    expect(storage.getItem('key')).toBeNull()
    expect(() => storage.setItem('key', 'value')).not.toThrow()
    expect(() => storage.removeItem('key')).not.toThrow()
  })
})
