import { AuthProvider } from './AuthProvider'

/**
 * Bearer Authentication HTTP provider that sets `Authorization: Bearer <token>` headers.
 * Accepts a static string or an asynchronous callback to resolve dynamic tokens.
 */
export class BearerAuthProvider implements AuthProvider {
   private token: string | (() => string | Promise<string>)

   constructor(token: string | (() => string | Promise<string>)) {
      this.token = token
   }

   /**
    * Generates the structured auth headers for fetch.
    * 
    * @returns A promise resolving to the headers record.
    */
   public async getHeaders(): Promise<Record<string, string>> {
      const resolvedToken = typeof this.token === 'function' ? await this.token() : this.token
      return {
         Authorization: `Bearer ${resolvedToken}`,
      }
   }
}
