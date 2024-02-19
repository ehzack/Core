import Middleware from './authentication/middlewares/Middleware';
export declare enum AuthAction {
    SIGNIN = "signin",
    SIGNUP = "signup",
    SIGNOUT = "signout"
}
/**
 * Authentication Parameters acceptable keys
 */
export type AuthParametersKeys = 'host' | 'alias' | 'mapping' | 'middlewares' | 'config' | 'fixtures' | 'debug';
/**
 * Backend parameters interface
 */
export interface AuthParameters {
    host?: string;
    alias?: string;
    mapping?: {
        [x: string]: any;
    };
    middlewares?: Middleware[];
    config?: any;
    fixtures?: any;
    softDelete?: boolean;
    debug?: boolean;
}
