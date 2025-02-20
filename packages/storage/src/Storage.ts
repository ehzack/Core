import { Core } from '@quatrain/core'
import { AbstractStorageAdapter } from './AbstractStorageAdapter'

/**
 * Backend Parameters acceptable keys
 */
export type StorageParametersKeys = 'region' | 'alias' | 'config' | 'debug'

/**
 * Backend parameters interface
 */
export interface StorageParameters {
   region?: string
   alias?: string
   config?: any
   debug?: boolean
}

export type StorageBackendRegistry<T extends AbstractStorageAdapter> = {
   [x: string]: T
}
export class Storage extends Core {
   static defaultStorage = '@default'
   static logger = this.addLogger('Storage')

   protected static _storages: StorageBackendRegistry<any> = {}

   static addStorage(
      adapter: AbstractStorageAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      this._storages[alias] = adapter
      if (setDefault) {
         this.defaultStorage = alias
      }
   }

   static getStorage<T extends AbstractStorageAdapter>(
      alias: string = this.defaultStorage
   ): T {
      if (this._storages[alias]) {
         return this._storages[alias]
      } else {
         throw new Error(`Unknown storage alias: '${alias}'`)
      }
   }
}
