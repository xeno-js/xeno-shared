import { describe, expect, it } from 'vitest'

import { SanitizeHelper } from '@/shared'

describe('SanitizeHelper', () => {
  it('should be frozen', () => {
    expect(Object.isFrozen(SanitizeHelper)).toBe(true)
  })

  describe('stripControlChars', () => {
    it('should remove control characters and trim the result', () => {
      expect(SanitizeHelper.stripControlChars('  hello\r\nworld\t  ')).toBe('helloworld')
    })

    it('should return undefined for missing or empty values', () => {
      expect(SanitizeHelper.stripControlChars(undefined)).toBeUndefined()
      expect(SanitizeHelper.stripControlChars('   ')).toBeUndefined()
    })

    it('should respect the maximum length', () => {
      expect(SanitizeHelper.stripControlChars('123456', 3)).toBe('123')
    })
  })

  describe('sanitizePath', () => {
    it('should remove controls, trim and preserve safe paths', () => {
      expect(SanitizeHelper.sanitizePath('  /users\n/1  ')).toBe('/users/1')
    })

    it('should return undefined for missing or empty paths', () => {
      expect(SanitizeHelper.sanitizePath(undefined)).toBeUndefined()
      expect(SanitizeHelper.sanitizePath('')).toBeUndefined()
    })

    it('should replace dangerous protocols with the root path', () => {
      expect(SanitizeHelper.sanitizePath('javascript:alert(1)')).toBe('/')
      expect(SanitizeHelper.sanitizePath('DATA:text/plain,payload')).toBe('/')
      expect(SanitizeHelper.sanitizePath('vbscript:run')).toBe('/')
    })

    it('should respect the maximum path length', () => {
      expect(SanitizeHelper.sanitizePath('/abcdef', 4)).toBe('/abc')
    })
  })

  describe('sanitizeStringArray', () => {
    it('should sanitize entries, remove empty values and limit item count', () => {
      expect(SanitizeHelper.sanitizeStringArray([' one\n', ' ', 'two', 'three'], 10, 3)).toEqual([
        'one',
        'two',
      ])
    })

    it('should respect the item length limit', () => {
      expect(SanitizeHelper.sanitizeStringArray(['123456'], 3)).toEqual(['123'])
    })

    it('should return undefined for missing or empty arrays', () => {
      expect(SanitizeHelper.sanitizeStringArray(undefined)).toBeUndefined()
      expect(SanitizeHelper.sanitizeStringArray([])).toBeUndefined()
    })
  })
})
