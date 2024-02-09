import { Core } from '../Core'
import * as statuses from '../statuses'
import { BackendInterface } from '../backends/AbstractAdapter'
import { Query } from '../backends/Query'
import { GoneError, NotFoundError } from '../common/ResourcesErrors'
import { BaseObjectCore } from './BaseObjectCore'
import { DataObject } from './DataObject'
import { DataObjectClass } from './types/DataObjectClass'
import Payload, { Meta } from './types/Payload'
import RepositoryClass from './types/RepositoryClass'
import { BaseObject } from './BaseObject'
import { Persisted } from './types/Persisted'
import { Proxy } from './types/ProxyConstructor'

const RESOURCE_GONE_ERROR = `The resource you are trying to access has been deleted.`

/**
 * CRUD methods for models/entities inheriting from BaseObject
 * Extend this by passing the typeof of the desired class to the constructor
 */
export default class BaseRepository<T extends BaseObject> {
   //implements RepositoryClass<T>
   protected _model: typeof BaseObjectCore
   backendAdapter: BackendInterface

   constructor(
      model: typeof BaseObjectCore,
      backendAdapter: BackendInterface = Core.getBackend()
   ) {
      this._model = model
      this.backendAdapter = backendAdapter
   }

   protected async getDataObjectFromUid(
      uid: string
   ): Promise<DataObjectClass<any>> {
      const collection =
         this._model.COLLECTION || this._model.name.toLowerCase()

      const path = `${collection}/${uid}`
      const dataObject = DataObject.factory({
         properties: this._model.PROPS_DEFINITION,
         uri: path,
      })

      dataObject.uid = uid

      return dataObject
   }

   async create<B extends BaseObjectCore>(obj: B, uid?: string) {
      const savedObj = await this.backendAdapter.create(obj.dataObject, uid)
      return this._model.fromDataObject(savedObj) //as Persisted<T>
   }

   async read(key: string) {
      const uid =
         key.indexOf('/') !== -1 ? key.substring(key.lastIndexOf('/')+1) : key

      try {
         const dataObject = await this.getDataObjectFromUid(uid)

         const response = await this.backendAdapter.read(dataObject)

         const obj = this._model.fromDataObject(response)

         // TODO should be moved to the backend middleware
         if (obj.status === statuses.DELETED) {
            throw new GoneError(RESOURCE_GONE_ERROR)
         }

         return obj
      } catch (e) {
         if (e instanceof GoneError) {
            throw e
         }

         if (e instanceof NotFoundError) {
            throw new NotFoundError('[Repository] ' + (e as Error).message)
         }

         throw e
      }
   }

   async update(obj: Proxy<T>) {
      const dataObject = obj.core.dataObject

      const savedObj = await this.backendAdapter.update(dataObject)

      return this._model.fromDataObject(savedObj) as Persisted<T>
   }

   async delete(uid: string) {
      const dataObject = await this.getDataObjectFromUid(uid)

      await this.backendAdapter.delete(dataObject)
   }

   async query(
      query: Query<typeof BaseObjectCore>
   ): Promise<Payload<Persisted<T>>> {
      const items = (await query.fetchAsInstances(
         this.backendAdapter
      )) as unknown as Persisted<T>[]

      const count = await this.backendAdapter.count(query)

      const meta: Meta = {
         count,
         updatedAt: new Date().getTime(),
      }

      const payload: Payload<Persisted<T>> = { items, meta }

      return payload
   }
}
