import { BackendAction } from '../Backend'
import { BaseObjectCore } from '../components'
import { DataObjectClass } from '../components/types/DataObjectClass'
import { Filter } from './Filter'
import { Filters } from './Filters'
import { Query } from './Query'
import { SortAndLimit } from './SortAndLimit'
import Middleware from './middlewares/Middleware'

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
   mapping?: { [x: string]: any }
   middlewares?: Middleware[]
   config?: any
   fixtures?: any
   softDelete?: boolean
   debug?: boolean
}

export interface BackendInterface {
   create(
      dataObject: DataObjectClass<any>,
      desiredUid: string | undefined
   ): Promise<DataObjectClass<any>>

   read(param: string | DataObjectClass<any>): Promise<DataObjectClass<any>>

   update(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>

   delete(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>

   query(query: Query<any>): Promise<DataObjectClass<any>[]>

   find(
      dataObject: DataObjectClass<any>,
      filters: Filters | Filter[] | undefined,
      pagination: SortAndLimit | undefined
   ): Promise<DataObjectClass<any>[]>
}

export abstract class AbstractAdapter {
   protected _alias: string = ''
   protected _params: BackendParameters = {}
   protected _middlewares: Middleware[] = []

   constructor(params: BackendParameters = {}) {
      this._alias = params.alias || ''
      this._middlewares = params.middlewares || []
   }

   setParam(key: BackendParametersKeys, value: any) {
      this._params[key] = value
   }

   getParam(key: BackendParametersKeys) {
      return this._params[key]
   }

   set alias(alias: string) {
      this._alias = alias
   }

   get alias() {
      return this._alias
   }

   getCollection(dao: DataObjectClass<any>) {
      return dao.uri.collection //|| dao.uri.class.name.toLowerCase() //class.COLLECTION
   }

   abstract create(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>>

   abstract read(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>>

   abstract update(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>>

   abstract delete(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>>

   abstract deleteCollection(
      collection: string,
      batchSize?: number
   ): Promise<void>

   /**
    * Process Query instance and return result
    * @param query
    * @returns Array
    */
   async query(query: Query<any>): Promise<DataObjectClass<any>[]> {
      return await this.find(
         await query.obj.daoFactory(),
         query.filters,
         query.sortAndLimit
      )
   }

   abstract find(
      dataObject: DataObjectClass<any>,
      filters: Filters | Filter[] | undefined,
      pagination: SortAndLimit | undefined
   ): Promise<DataObjectClass<any>[]>

   log(message: string) {
      if (this._params['debug'] === true) {
         console.log(message)
      }
   }

   async executeMiddlewares(
      dataObject: DataObjectClass<any>,
      action: BackendAction
   ) {
      for (const middleware of this._middlewares)
         await middleware.execute(dataObject, action)

      return dataObject
   }
}
