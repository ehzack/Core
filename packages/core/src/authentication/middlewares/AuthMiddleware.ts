import { AuthAction } from '../../Auth'
import { User } from '../../components/User'

export default interface AuthMiddleware {
   execute: (user: User, action: AuthAction) => void
}
