import { DataObject } from '../components'

export interface BackendRecordType {
   uid: string | undefined
   [key: string]: string | number | boolean | any[] | Object | undefined
}

export type BackendParametersKeys =
   | 'alias'
   | 'mapping'
   | 'injectMeta'
   | 'config'
   | 'fixtures'
   | 'softDelete'
   | 'debug'

export interface BackendParameters {
   alias?: string
   mapping?: { [x: string]: any }
   injectMeta?: boolean
   config?: any
   fixtures?: any
   softDelete?: boolean
   debug?: boolean
}

export interface BackendInterface {
   create(
      dataObject: DataObject,
      desiredUid: string | undefined
   ): Promise<DataObject>

   read(param: string | DataObject): Promise<DataObject>

   update(dataObject: DataObject): Promise<DataObject>

   delete(dataObject: DataObject): Promise<DataObject>
}

export abstract class AbstractAdapter {
   protected _alias: string = ''
   protected _params: BackendParameters = {}
   protected _injectMeta: boolean = false

   constructor(params: BackendParameters) {
      this._alias = params.alias || ''
      this._injectMeta = params.injectMeta || false
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

   log(message: string) {
      if (this._params['debug'] === true) {
         console.log(message)
      }
   }
}
