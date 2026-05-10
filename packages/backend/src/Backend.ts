import { Core } from '@quatrain/core'
import Middleware from './middlewares/Middleware'
import { AbstractBackendAdapter } from './AbstractBackendAdapter'

export enum BackendAction {
   CREATE = 'create',
   READ = 'read',
   UPDATE = 'update',
   DELETE = 'delete',
   WRITE = 'write',
}

/**
 * Default interface for a backend record
 */
export interface BackendRecordType {
   uid: string | undefined
   path: string | undefined
   [key: string]: any
}

/**
 * Backend Parameters acceptable keys
 */
export type BackendParametersKeys =
   | 'host'
   | 'alias'
   | 'mapping'
   | 'middlewares'
   | 'config'
   | 'fixtures'
   | 'softDelete'
   | 'debug'

/**
 * Backend parameters interface
 */
export interface BackendParameters {
   host?: string
   alias?: string
   hierarchy?: { [collection: string]: any }
   mapping?: { [x: string]: any }
   middlewares?: Middleware[]
   config?: any
   fixtures?: any
   softDelete?: boolean
   useNativeForeignKeys?: boolean
   debug?: boolean
}

export type BackendRegistry<T extends AbstractBackendAdapter> = {
   [x: string]: T
}

/**
 * The core static class managing the registration and retrieval of backend adapters.
 * Quatrain supports multiple concurrent backends, allowing different models to route their persistence to different data stores (e.g. Postgres, Firestore, REST).
 */
export class Backend extends Core {
   /** The alias of the currently active default backend adapter. */
   static defaultBackend = 'default'
   /** Global reference to the registered user class for authentication and relationships. */
   static userClass: any
   /** Winston logger instance dedicated to the Backend module. */
   static logger = this.addLogger('Backend')

   /** Internal registry mapping aliases to their configured `AbstractBackendAdapter` instances. */
   protected static _backends: BackendRegistry<any> = {}

   /**
    * Registers a new backend adapter instance into the global registry.
    * 
    * @param backend - An instantiated adapter (e.g., `FirestoreAdapter`, `PostgresAdapter`).
    * @param alias - The string identifier used to retrieve this backend later.
    * @param setDefault - If true, this adapter becomes the default fallback for all operations.
    */
   static addBackend(
      backend: AbstractBackendAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      this._backends[alias] = backend
      if (setDefault) {
         this.defaultBackend = alias
      }
   }

   /**
    * Retrieves a configured backend adapter from the registry by its alias.
    * 
    * @param alias - The string identifier of the backend to retrieve (defaults to the `defaultBackend`).
    * @returns The requested `AbstractBackendAdapter` instance.
    * @throws {Error} If the requested alias is not found in the registry.
    */
   static getBackend<T extends AbstractBackendAdapter>(
      alias: string = this.defaultBackend
   ): T {
      if (this._backends[alias]) {
         return this._backends[alias]
      } else {
         throw new Error(`Unknown backend alias: '${alias}'`)
      }
   }
}
