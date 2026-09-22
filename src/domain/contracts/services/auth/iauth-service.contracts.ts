import type { ResultType } from '@/domain'
import type { AuthClaims, Maybe, Optional, Provider, Session } from '@/shared'

/**
 * @description IAuthService defines the contract for authentication services.
 * It provides methods to check if a user is authenticated and to retrieve the user's claims.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export interface IBaseAuthService {
  /**
   * Checks if the user is authenticated.
   * @returns A promise that resolves to true if the user is authenticated, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
  isAuthenticated(): Promise<boolean>

  /**
   * Restituisce l'utente attualmente autenticato.
   */
  getUser(): Promise<ResultType<Maybe<AuthClaims>>>

  /**
   * Authenticates a user based on a token.
   * @param token The token to authenticate the user.
   * @returns A promise that resolves to the user's claims, or null if not authenticated.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
  authenticate(token: string): Promise<ResultType<AuthClaims>>
}

/**
 * @description IAuthService defines the contract for authentication services.
 * It provides methods to check if a user is authenticated and to retrieve the user's claims.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export interface IAuthService {
  /**
   * Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).
   */
  signInWithProvider(provider: Provider): Promise<ResultType<{ url: string }>>

  /**
   * Restituisce la sessione corrente attiva salvata nel client Supabase.
   */
  getSession(): Promise<ResultType<Maybe<Session>>>

  /**
   * Esegue il logout dell'utente e pulisce la sessione locale.
   */
  signOut(): Promise<ResultType<void>>

  exchangeCodeForSession(code: string): Promise<ResultType<Optional<Session>>>
}

export interface IExtendendService extends IBaseAuthService, IAuthService {}
