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
   // middlewares?: Middleware[]
   config?: any
   debug?: boolean
}
