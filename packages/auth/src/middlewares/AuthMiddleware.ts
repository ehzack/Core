import { AuthAction } from '../Auth'
import { User } from '@quatrain/core'

export default interface AuthMiddleware {
   execute: (user: User, action: AuthAction) => void
}
