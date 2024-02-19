import { AuthAction, AuthParameters, AuthParametersKeys } from '../Auth'
import { Filter, Filters, QueryResultType, SortAndLimit } from '../backends'
import { User } from '../components/User'
import Middleware from './middlewares/Middleware'
import { AuthInterface } from './types/AuthInterface'

export abstract class AbstractAuthAdapter implements AuthInterface {
   protected _alias: string = ''
   protected _params: AuthParameters = {}
   protected _middlewares: any[] = []

   constructor(params: AuthParameters = {}) {
      this._alias = params.alias || ''
      this._middlewares = params.middlewares || []
   }

   setParam(key: AuthParametersKeys, value: any) {
      this._params[key] = value
   }

   getParam(key: AuthParametersKeys) {
      return this._params[key]
   }

   addMiddleware(middleware: Middleware) {
      this._middlewares.push(middleware)
   }

   set alias(alias: string) {
      this._alias = alias
   }

   get alias() {
      return this._alias
   }

   abstract register(user: User): Promise<any>

   abstract signup(login: string, password: string): Promise<any>

   abstract signout(user: User): Promise<any>

   abstract update(user: User, updatable: any): Promise<any>

   abstract delete(user: User): Promise<any>

   abstract getAuthToken(token: string): any

   // abstract find(
   //    filters: Filters | Filter[] | undefined,
   //    pagination: SortAndLimit | undefined
   // ): Promise<QueryResultType<User>>

   // async executeMiddlewares(
   //    user: User,
   //    action: AuthAction
   // ) {
   //    for (const middleware of this._middlewares) {
   //       await middleware.execute(user, action)
   //    }

   //    return user
   // }
}
