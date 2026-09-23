import type { Session as SupabaseSession, SupabaseClient, User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IBaseMapper } from '@/domain'
import { AppError } from '@/domain'
import type { AuthClaims, Session } from '@/shared'
import { ERROR_CODES, STATUS_CODES } from '@/shared'

import { SupabaseAuthService } from '../supabase-auth.service'

describe('SupabaseAuthService', () => {
  const getUserMock = vi.fn()
  const getSessionMock = vi.fn()
  const mapMock = vi.fn()
  const exchangeCodeForSessionMock = vi.fn()
  const signInWithOAuthMock = vi.fn()
  const signOutMock = vi.fn()

  let mockSupabaseClient: SupabaseClient
  let mockMapper: IBaseMapper<User, AuthClaims>
  let mockSessionMapper: IBaseMapper<SupabaseSession, Session>
  let sut: SupabaseAuthService
  const config = {
    redirectTo: undefined,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabaseClient = {
      auth: {
        getUser: getUserMock,
        getSession: getSessionMock,
        exchangeCodeForSession: exchangeCodeForSessionMock,
        signInWithOAuth: signInWithOAuthMock,
        signOut: signOutMock,
      },
    } as unknown as SupabaseClient

    mockMapper = {
      map: mapMock,
    }

    mockSessionMapper = {
      map: mapMock,
    }

    sut = new SupabaseAuthService(mockSupabaseClient, mockMapper, mockSessionMapper, config)
  })

  // ─── Test Suite: authenticate ──────────────────────────────────────────────
  describe('authenticate', () => {
    const fakeToken = 'valid-supabase-jwt-token'

    it('should return a failed Result containing a standardized AppError when Supabase auth returns an error', async () => {
      // Arrange
      const supabaseError = { message: 'Auth token has expired' }
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: supabaseError,
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(getUserMock).toHaveBeenCalledOnce()
      expect(getUserMock).toHaveBeenCalledWith(fakeToken)
      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe(ERROR_CODES.AUTHENTICATION_FAILED)
      expect(error.status).toBe(STATUS_CODES.UNAUTHORIZED)
    })

    it('should fall back to "Unknown error" when Supabase error message is missing or undefined', async () => {
      // Arrange
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: { message: undefined },
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(result.isOk()).toBe(false)
    })

    it('should return a failed Result if Supabase returns no error but the user object is undefined', async () => {
      // Arrange
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(result.isOk()).toBe(false)
    })

    it('should map the user to claims and return a successful Result when authentication succeeds', async () => {
      // Arrange
      const fakeUser = { id: 'usr-456', email: 'user@Xeno.it' } as User
      const expectedClaims: AuthClaims = {
        sub: 'usr-456',
        email: 'admin@example.com',
        name: 'admin',
        tenantId: 'tenant-789',
        roles: ['USER'],
        permissions: ['read:items'],
      }

      getUserMock.mockResolvedValue({
        data: { user: fakeUser },
        error: null,
      })
      mapMock.mockReturnValue(expectedClaims)

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(getUserMock).toHaveBeenCalledWith(fakeToken)
      expect(mapMock).toHaveBeenCalledOnce()
      expect(mapMock).toHaveBeenCalledWith(fakeUser)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(expectedClaims)
    })
  })

  // ─── Test Suite: isAuthenticated ───────────────────────────────────────────
  describe('isAuthenticated', () => {
    it('should return true when an active session exists in Supabase context', async () => {
      // Arrange
      const fakeSession = { id: 'session-active-abc' }
      getSessionMock.mockResolvedValue({
        data: { session: fakeSession },
      })

      // Act
      const isAuth = await sut.isAuthenticated()

      // Assert
      expect(getSessionMock).toHaveBeenCalledOnce()
      expect(isAuth).toBe(true)
    })

    it('should return false when session is null or undefined', async () => {
      // Arrange
      getSessionMock.mockResolvedValue({
        data: { session: null },
      })

      // Act
      const isAuth = await sut.isAuthenticated()

      // Assert
      expect(getSessionMock).toHaveBeenCalledOnce()
      expect(isAuth).toBe(false)
    })
  })
  describe('remaining auth operations', () => {
    it('should exchange a code and map the session', async () => {
      const supabaseSession = {} as SupabaseSession
      const expectedSession = { accessToken: 'token' } as Session
      exchangeCodeForSessionMock.mockResolvedValue({
        data: { session: supabaseSession },
        error: null,
      })
      mapMock.mockReturnValue(expectedSession)

      const result = await sut.exchangeCodeForSession('code')

      expect(exchangeCodeForSessionMock).toHaveBeenCalledWith('code')
      expect(result.getValueOrThrow()).toBe(expectedSession)
    })

    it('should fail when exchanging a code fails or has no session', async () => {
      exchangeCodeForSessionMock.mockResolvedValue({
        data: { session: null },
        error: { message: 'bad code' },
      })
      expect((await sut.exchangeCodeForSession('bad')).isOk()).toBe(false)
      exchangeCodeForSessionMock.mockResolvedValue({ data: { session: null }, error: null })
      expect((await sut.exchangeCodeForSession('empty')).isOk()).toBe(false)
    })

    it('should handle provider sign-in success and failures', async () => {
      signInWithOAuthMock.mockResolvedValue({ data: { url: 'https://auth.test' }, error: null })
      expect((await sut.signInWithProvider('google')).getValueOrThrow()).toEqual({
        url: 'https://auth.test',
      })
      signInWithOAuthMock.mockResolvedValue({ data: { url: '' }, error: null })
      expect((await sut.signInWithProvider('google')).isOk()).toBe(false)
      signInWithOAuthMock.mockResolvedValue({
        data: { url: null },
        error: { message: 'oauth failed' },
      })
      expect((await sut.signInWithProvider('google')).isOk()).toBe(false)
    })

    it('should get, map, and handle absent or failed sessions', async () => {
      const supabaseSession = {} as SupabaseSession
      const expectedSession = { accessToken: 'token' } as Session
      getSessionMock.mockResolvedValue({ data: { session: supabaseSession }, error: null })
      mapMock.mockReturnValue(expectedSession)
      expect((await sut.getSession()).getValueOrThrow()).toBe(expectedSession)
      getSessionMock.mockResolvedValue({ data: { session: null }, error: null })
      expect((await sut.getSession()).getValueOrThrow()).toBeUndefined()
      getSessionMock.mockResolvedValue({
        data: { session: null },
        error: { message: 'session failed' },
      })
      expect((await sut.getSession()).isOk()).toBe(false)
    })

    it('should get and map users, sign out, and return session tokens', async () => {
      const user = { id: 'user' } as User
      const claims = { sub: 'user' } as AuthClaims
      getUserMock.mockResolvedValue({ data: { user }, error: null })
      mapMock.mockReturnValue(claims)
      expect((await sut.getUser()).getValueOrThrow()).toBe(claims)
      getUserMock.mockResolvedValue({ data: { user: null }, error: null })
      expect((await sut.getUser()).getValueOrThrow()).toBeUndefined()
      getUserMock.mockResolvedValue({ data: { user: null }, error: { message: 'user failed' } })
      expect((await sut.getUser()).isOk()).toBe(false)
      signOutMock.mockResolvedValue({ error: null })
      expect((await sut.signOut()).isOk()).toBe(true)
      signOutMock.mockResolvedValue({ error: { message: 'sign out failed' } })
      expect((await sut.signOut()).isOk()).toBe(false)
      getSessionMock.mockResolvedValue({ data: { session: {} }, error: null })
      mapMock.mockReturnValue({ accessToken: 'token' })
      expect((await sut.getSessionToken()).getValueOrThrow()).toBe('token')
      getSessionMock.mockResolvedValue({ data: { session: null }, error: null })
      expect((await sut.getSessionToken()).getValueOrThrow()).toBeUndefined()
      getSessionMock.mockResolvedValue({
        data: { session: null },
        error: { message: 'token failed' },
      })
      expect((await sut.getSessionToken()).isOk()).toBe(false)
    })
  })
})
