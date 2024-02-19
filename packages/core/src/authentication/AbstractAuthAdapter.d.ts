import { AuthParameters, AuthParametersKeys } from '../Auth';
import { User } from '../components/User';
import Middleware from './middlewares/Middleware';
import { AuthInterface } from './types/AuthInterface';
export declare abstract class AbstractAuthAdapter implements AuthInterface {
    protected _alias: string;
    protected _params: AuthParameters;
    protected _middlewares: any[];
    constructor(params?: AuthParameters);
    setParam(key: AuthParametersKeys, value: any): void;
    getParam(key: AuthParametersKeys): any;
    addMiddleware(middleware: Middleware): void;
    set alias(alias: string);
    get alias(): string;
    abstract register(user: User): Promise<any>;
    abstract signup(login: string, password: string): Promise<any>;
    abstract signout(user: User): Promise<any>;
    abstract update(user: User, updatable: any): Promise<any>;
    abstract delete(user: User): Promise<any>;
    abstract getAuthToken(token: string): any;
}
