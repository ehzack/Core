import { Api, ApiMiddleware, ApiRequest, ApiResponse } from '@quatrain/api'

export class AuthBasic {
   private user: string
   private pass: string

   constructor(user: string, pass: string) {
      this.user = user
      this.pass = pass
   }

   static factory(userOrConfig?: string | any, pass?: string): AuthBasic | null {
      if (typeof userOrConfig === 'object') {
         if (!userOrConfig.user || !userOrConfig.pass) return null
         return new AuthBasic(userOrConfig.user, userOrConfig.pass)
      }
      if (!userOrConfig || !pass) return null
      return new AuthBasic(userOrConfig, pass)
   }

   public middleware(): ApiMiddleware {
      return async (req: ApiRequest, res: ApiResponse): Promise<boolean> => {
         const b64auth = ((req.headers.authorization as string) || '').split(' ')[1] || ''
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
