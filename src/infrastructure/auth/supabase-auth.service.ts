import type {
  Provider,
  Session as SupabaseSession,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'

import type { IAuthService, IBaseAuthService, IBaseMapper, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { AuthClaims, Maybe, Optional, Session } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description The SupabaseAuthService class is responsible for handling authentication-related operations using a SupabaseClient instance. It implements the IAuthService interface, providing methods to check if a user is authenticated and to retrieve authentication claims from a given token. The authenticate method interacts with the Supabase authentication API to fetch user information based on the provided token, while the isAuthenticated method checks if there is an active session. The class also includes error handling to create standardized authentication errors when necessary.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class SupabaseAuthService implements IBaseAuthService, IAuthService {
  constructor(
    private readonly _supabase: SupabaseClient,
    private readonly _mapper: IBaseMapper<User, AuthClaims>,
    private readonly _sessionMapper: IBaseMapper<SupabaseSession, Session>,
    private readonly _opts: { redirectTo: Optional<string> },
  ) {}

  public async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    const { data, error } = await this._supabase.auth.getUser(token)

    if (Guards.isDefined(error) || !Guards.isDefined(data.user)) {
      return Result.fail(
        AppError.authFailed('SupabaseAuthenticationService', error?.message ?? 'Unknown error'),
      )
    }

    const user = data.user
    const claims = this._mapper.map(user)
    return Result.ok(claims)
  }

  public async isAuthenticated(): Promise<boolean> {
    const session = await this._supabase.auth.getSession()
    return Guards.isDefined(session.data.session)
  }

  public async exchangeCodeForSession(code: string): Promise<ResultType<Optional<Session>>> {
    const { data, error } = await this._supabase.auth.exchangeCodeForSession(code)
    if (Guards.isDefined(error) || !Guards.isDefined(data.session))
      return Result.fail(
        AppError.authFailed('SupabaseAuthenticationService', error?.message ?? 'Unknown error'),
      )

    const session = data.session

    if (Guards.isDefined(session)) return Result.ok(this._sessionMapper.map(session))

    return Result.ok()
  }

  public async signInWithProvider(provider: Provider): Promise<ResultType<{ url: string }>> {
    const { data, error } = await this._supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: this._opts.redirectTo },
    })

    if (Guards.isDefined(error) || Guards.isNullOrEmpty(data.url)) {
      return Result.fail(
        AppError.authFailed('SupabaseFrontendAuthService', error?.message ?? 'Unexpected error'),
      )
    }

    return Result.ok({ url: data.url })
  }

  public async getSession(): Promise<ResultType<Maybe<Session>>> {
    const { data, error } = await this._supabase.auth.getSession()
    if (Guards.isDefined(error)) {
      return Result.fail(AppError.authFailed('SupabaseFrontendAuthService', error.message))
    }

    const session = data.session

    if (Guards.isDefined(session)) return Result.ok(this._sessionMapper.map(data.session!))

    return Result.ok()
  }

  public async getUser(): Promise<ResultType<Maybe<AuthClaims>>> {
    const { data, error } = await this._supabase.auth.getUser()
    if (Guards.isDefined(error)) {
      return Result.fail(AppError.authFailed('SupabaseFrontendAuthService', error.message))
    }
    const user = data.user
    if (Guards.isDefined(user)) return Result.ok(this._mapper.map(user))

    return Result.ok()
  }

  public async signOut(): Promise<ResultType<void>> {
    const { error } = await this._supabase.auth.signOut()
    if (Guards.isDefined(error)) {
      return Result.fail(AppError.authFailed('SupabaseFrontendAuthService', error.message))
    }
    return Result.ok()
  }

  public async getSessionToken(): Promise<ResultType<Optional<string>>> {
    const sessionResult = await this.getSession()
    if (!sessionResult.isOk()) {
      return Result.fail(sessionResult.getErrorOrThrow())
    }
    const session = sessionResult.getValueOrThrow()
    return Result.ok(session?.accessToken)
  }
}
