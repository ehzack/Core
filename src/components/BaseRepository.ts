import { Core } from '../Core'
import * as statuses from '../statuses'
import { BackendInterface } from '../backends/AbstractAdapter'
import { Query } from '../backends/Query'
import { GoneError, NotFoundError } from '../common/ResourcesErrors'
import { BaseObjectCore } from './BaseObject'
import { DataObject } from './DataObject'
import { DataObjectClass } from './types/DataObjectClass'
import Payload, { Meta } from './types/Payload'
import RepositoryClass from './types/RepositoryClass'
import { BaseObject } from './BaseObjectProperties'
import { Persisted } from './types/Persisted'
import { Proxy } from './types/ProxyConstructor'

const RESOURCE_GONE_ERROR = `The resource you are trying to access has been deleted.`

/**
 * CRUD methods for models/entities inheriting from BaseObject
 * Extend this by passing the typeof of the desired class to the constructor
 */
export default class BaseRepository<T extends BaseObject>
   implements RepositoryClass<T>
{
   protected model: typeof BaseObjectCore
   backendAdapter: BackendInterface

   constructor(
      model: typeof BaseObjectCore,
      backendAdapter: BackendInterface = Core.getBackend()
   ) {
      this.model = model

      this.backendAdapter = backendAdapter
   }

   protected async getDataObjectFromUid(
      uid: string
   ): Promise<DataObjectClass<any>> {
      const collection = this.model.COLLECTION || this.model.name.toLowerCase()

      const path = `${collection}/${uid}`

      const dataObject = await DataObject.factory({
         properties: this.model.PROPS_DEFINITION,
         uri: path,
      })

      dataObject.uid = uid

      return dataObject
   }

   async create(obj: Proxy<T>, uid?: string) {
      const dataObject = obj.core.dataObject

      const savedObj = await this.backendAdapter.create(dataObject, uid)

      return this.model.fromDataObject(savedObj) as Persisted<T>
   }

   async read(uid: string) {
      try {
         const dataObject = await this.getDataObjectFromUid(uid)

         const response = await this.backendAdapter.read(dataObject)

         const obj = this.model.fromDataObject(response) as Persisted<T>

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

      return this.model.fromDataObject(savedObj) as Persisted<T>
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

      const meta: Meta = {
         count: items.length,
         updatedAt: new Date().getTime(),
      }

      const payload: Payload<Persisted<T>> = { items, meta }

      return payload
   }
}
