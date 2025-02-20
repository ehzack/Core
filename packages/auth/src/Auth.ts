import { Core } from '@quatrain/core'
import { AbstractAuthAdapter } from './AbstractAuthAdapter'
import Middleware from './middlewares/AuthMiddleware'

export enum AuthAction {
   SIGNIN = 'signin',
   SIGNUP = 'signup',
   SIGNOUT = 'signout',
}

/**
 * Authentication Parameters acceptable keys
 */
export type AuthParametersKeys =
   | 'host'
   | 'alias'
   | 'middlewares'
   | 'config'
   | 'fixtures'
   | 'debug'

/**
 * Backend parameters interface
 */
export interface AuthParameters {
   host?: string
   alias?: string
   middlewares?: Middleware[]
   config?: any
   fixtures?: any
   debug?: boolean
}

export interface AuthAdapter extends AbstractAuthAdapter {}

export type AuthRegistry<T extends AbstractAuthAdapter> = { [x: string]: T }

export class Auth extends Core {
   static defaultProvider = 'default'
   static logger = this.addLogger('Auth')


   static ERROR_EMAIL_EXISTS = `User email already exists`

   protected static _providers: AuthRegistry<any> = {}

   static addProvider(
      provider: AbstractAuthAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      this._providers[alias] = provider
      if (setDefault) {
         this.defaultProvider = alias
      }
   }

   static getProvider<T extends AbstractAuthAdapter>(
      alias: string = this.defaultProvider
   ): T {
      if (this._providers[alias]) {
         return this._providers[alias]
      } else {
         throw new Error(`Unknown provider alias: '${alias}'`)
      }
   }
}
