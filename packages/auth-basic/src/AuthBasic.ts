import { Api, ApiMiddleware, ApiRequest, ApiResponse } from '@quatrain/api'
import { Buffer } from 'node:buffer'

/**
 * A rudimentary Basic Authentication implementation (RFC 7617).
 * Parses `Authorization: Basic <base64>` headers for hardcoded credentials.
 */
export class AuthBasic {
   private user: string
   private pass: string

   constructor(user: string, pass: string) {
      this.user = user
      this.pass = pass
   }

   /**
    * Instantiates a new Basic Auth verifier.
    * 
    * @param userOrConfig - Username string, or a config object containing `{user, pass}`.
    * @param pass - Password string.
    * @returns The generated instance, or null if params are invalid.
    */
   static factory(userOrConfig?: string | any, pass?: string): AuthBasic | null {
      if (typeof userOrConfig === 'object') {
         if (!userOrConfig.user || !userOrConfig.pass) return null
         return new AuthBasic(userOrConfig.user, userOrConfig.pass)
      }
      if (!userOrConfig || !pass) return null
      return new AuthBasic(userOrConfig, pass)
   }

   /**
    * Returns an Express-compatible API middleware.
    * Validates the request headers against the configured Basic credentials.
    * 
    * @returns The middleware function.
    */
   public middleware(): ApiMiddleware {
      return async (req: ApiRequest, res: ApiResponse): Promise<boolean> => {
         const b64auth = ((req.headers?.authorization as string) || '').split(' ')[1] || ''
         const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

         if (login && password && login === this.user && password === this.pass) {
            return true // Continue to next middleware/handler
         }

         res.setHeader('WWW-Authenticate', 'Basic realm="Core API"')
         res.status(401).send('Authentication required.')
         return false // Stop processing
      }
   }
}
