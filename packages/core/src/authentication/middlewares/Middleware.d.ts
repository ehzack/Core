import { AuthAction } from '../../Auth';
import { User } from '../../components/User';
export default interface Middleware {
    execute: (user: User, action: AuthAction) => void;
}
