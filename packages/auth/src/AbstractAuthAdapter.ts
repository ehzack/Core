import { AuthParameters, AuthParametersKeys } from './Auth'
import { User } from '@quatrain/backend'
import { AuthInterface } from './types/AuthInterface'

export abstract class AbstractAuthAdapter implements AuthInterface {
   static UserClass = User
   protected _alias: string = ''
   protected _params: AuthParameters = {}

   constructor(params: AuthParameters = {}) {
      this._alias = params.alias || ''
   }

   setParam(key: AuthParametersKeys, value: any) {
      this._params[key] = value
   }

   getParam(key: AuthParametersKeys) {
      return this._params[key]
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

   abstract revokeAuthToken(token: string): any

   abstract setCustomUserClaims(id: string, claims: any): any
}
