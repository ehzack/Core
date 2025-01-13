import { AuthAction } from '../Auth'
import { User } from '@quatrain/backend'

export default interface AuthMiddleware {
   execute: (user: User, action: AuthAction) => void
}
