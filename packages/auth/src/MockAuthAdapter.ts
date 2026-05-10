import { AbstractAuthAdapter } from './AbstractAuthAdapter'
import { User } from '@quatrain/backend'
import { AuthParameters } from './Auth'

/**
 * Mock Authentication Adapter for testing purposes
 */
export class MockAuthAdapter extends AbstractAuthAdapter {
   private registeredUsers: Map<string, User> = new Map()
   private tokens: Map<string, any> = new Map()
   private refreshTokens: Map<string, string> = new Map()

   constructor(params: AuthParameters = {}) {
      super(params)
   }

   /**
    * Mock registration. Stores the user in memory mapped by email.
    * 
    * @param user - Target user.
    * @param clearPassword - Ignored in mock context.
    * @returns A mock success promise.
    */
   async register(user: User, clearPassword?: string): Promise<any> {
      if (this.registeredUsers.has(user._.email)) {
         throw new Error('User email already exists')
      }
      this.registeredUsers.set(user._.email, user)
      return { success: true, user }
   }

   /**
    * Mock signup. Generates mock JWT tokens assuming the login is valid.
    * 
    * @param login - Mock user identifier.
    * @param password - Mock password.
    * @returns Emulated auth response payload.
    */
   async signup(login: string, password: string): Promise<any> {
      const user = this.registeredUsers.get(login)
      if (!user) {
         throw new Error('User not found')
      }

      const token = `mock-token-${Date.now()}`
      const refreshToken = `mock-refresh-token-${Date.now()}`

      this.tokens.set(token, { user, timestamp: Date.now() })
      this.refreshTokens.set(refreshToken, token)

      return {
         success: true,
         token,
         refreshToken,
         user,
      }
   }

   /**
    * Deletes active tokens tied to the provided mock user.
    * 
    * @param user - User instance to sign out.
    */
   async signout(user: User): Promise<any> {
      // Remove all tokens associated with this user
      for (const [token, data] of this.tokens.entries()) {
         if (data.user._.email === user._.email) {
            this.tokens.delete(token)
         }
      }
      return { success: true }
   }

   /**
    * Mock user state update in memory.
    * 
    * @param user - Target user.
    * @param updatable - Property modifications.
    */
   async update(user: User, updatable: any): Promise<any> {
      const existingUser = this.registeredUsers.get(user._.email)
      if (!existingUser) {
         throw new Error('User not found')
      }

      const updatedUser = { ...existingUser, ...updatable }
      this.registeredUsers.set(user._.email, updatedUser)

      return { success: true, user: updatedUser }
   }

   /**
    * Evicts the user and all associated mock tokens from memory.
    * 
    * @param user - User instance to delete.
    */
   async delete(user: User): Promise<any> {
      if (!this.registeredUsers.has(user._.email)) {
         throw new Error('User not found')
      }

      this.registeredUsers.delete(user._.email)
      await this.signout(user)

      return { success: true }
   }

   /**
    * Reads the cached token data payload.
    * 
    * @param token - Raw mock token string.
    */
   getAuthToken(token: string): any {
      const tokenData = this.tokens.get(token)
      if (!tokenData) {
         throw new Error('Invalid token')
      }
      return tokenData
   }

   /**
    * Cycles an old refresh token for a completely new session pair.
    * 
    * @param refreshToken - Active mock refresh token string.
    */
   async refreshToken(refreshToken: string): Promise<any> {
      const oldToken = this.refreshTokens.get(refreshToken)
      if (!oldToken) {
         throw new Error('Invalid refresh token')
      }

      const tokenData = this.tokens.get(oldToken)
      if (!tokenData) {
         throw new Error('Token not found')
      }

      // Generate new tokens
      const newToken = `mock-token-${Date.now()}`
      const newRefreshToken = `mock-refresh-token-${Date.now()}`

      // Remove old tokens
      this.tokens.delete(oldToken)
      this.refreshTokens.delete(refreshToken)

      // Add new tokens
      this.tokens.set(newToken, tokenData)
      this.refreshTokens.set(newRefreshToken, newToken)

      return {
         success: true,
         token: newToken,
         refreshToken: newRefreshToken,
      }
   }

   /**
    * Blacklists a specific access token.
    * 
    * @param token - Target mock token to drop.
    */
   revokeAuthToken(token: string): any {
      if (!this.tokens.has(token)) {
         throw new Error('Token not found')
      }

      this.tokens.delete(token)

      // Remove associated refresh token
      for (const [
         refreshToken,
         associatedToken,
      ] of this.refreshTokens.entries()) {
         if (associatedToken === token) {
            this.refreshTokens.delete(refreshToken)
            break
         }
      }

      return { success: true }
   }

   /**
    * Manually appends structural role claims onto a registered mock user.
    * 
    * @param id - Mock user ID.
    * @param claims - Payload to merge.
    */
   setCustomUserClaims(id: string, claims: any): any {
      // Find user by id and set custom claims
      for (const [email, user] of this.registeredUsers.entries()) {
         if ((user as any)._.id === id) {
            ;(user as any).customClaims = claims
            return { success: true, claims }
         }
      }
      throw new Error('User not found')
   }

   // Helper methods for testing
   /**
    * Test utility: Flushes all internal registers.
    */
   clearAll(): void {
      this.registeredUsers.clear()
      this.tokens.clear()
      this.refreshTokens.clear()
   }

   /**
    * Test utility: Retrieves user instance by its stored key (email).
    */
   getUserByEmail(email: string): User | undefined {
      return this.registeredUsers.get(email)
   }

   /**
    * Test utility: Asserts the existence of an active token.
    */
   hasToken(token: string): boolean {
      return this.tokens.has(token)
   }
}
