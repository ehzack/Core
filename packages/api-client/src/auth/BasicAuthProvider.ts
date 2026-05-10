import { AuthProvider } from './AuthProvider'

/**
 * Basic Authentication HTTP provider that sets `Authorization: Basic <base64>`
 * headers using either a raw string or username/password combinations.
 */
export class BasicAuthProvider implements AuthProvider {
   private token: string

   constructor(username: string, password?: string) {
      if (password !== undefined) {
         // Create base64 token if both are provided
         this.token = Buffer.from(`${username}:${password}`).toString('base64')
      } else {
         // Assume the username argument is already the base64 token
         this.token = username
      }
   }

   /**
    * Generates the structured auth headers for fetch.
    * 
    * @returns A promise resolving to the headers record.
    */
   public async getHeaders(): Promise<Record<string, string>> {
      return {
         Authorization: `Basic ${this.token}`,
      }
   }
}
