import { statuses } from '..'
import { BackendInterface } from '../backends/AbstractAdapter'
import { Query } from '../backends/Query'
import { GoneError, NotFoundError } from '../common/ResourcesErrors'
import { BaseObject } from './BaseObject'
import { DataObject } from './DataObject'
import { DataObjectClass } from './types/DataObjectClass'
import Payload, { Meta } from './types/Payload'
import RepositoryClass from './types/RepositoryClass'

const RESOURCE_GONE_ERROR = `The resource you are trying to access has been deleted.`

/**
 * CRUD methods for models/entities inheriting from BaseObject
 * Extend this by passing the typeof of the desired class to the constructor
 */
export default abstract class AbstractRepository<T extends BaseObject>
   implements RepositoryClass<T>
{
   protected model: typeof BaseObject
   backendAdapter: BackendInterface

   constructor(model: typeof BaseObject, backendAdapter: BackendInterface) {
      this.model = model
      this.backendAdapter = backendAdapter
   }

   protected async getDataObjectFromUid(
      uid: string
   ): Promise<DataObjectClass<any>> {
      const path = `${this.model.COLLECTION}/${uid}`

      const dataObject = await DataObject.factory({
         properties: this.model.PROPS_DEFINITION,
         uri: path,
      })

      return dataObject
   }

   async create(obj: T, uid?: string): Promise<T> {
      const dataObject = obj.dataObject

      const savedObj = await this.backendAdapter.create(dataObject, uid)

      return this.model.instantiateFromDataObject(savedObj) as T
   }

   async read(uid: string) {
      try {
         const dataObject = await this.getDataObjectFromUid(uid)

         const response = await this.backendAdapter.read(dataObject)

         const obj = this.model.instantiateFromDataObject(response) as T

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

   async update(obj: T): Promise<T> {
      const dataObject = obj.dataObject

      const savedObj = await this.backendAdapter.update(dataObject)

      return this.model.instantiateFromDataObject(savedObj) as T
   }

   async softDelete(uid: string): Promise<T> {
      const obj = await this.read(uid)

      obj.status = statuses.DELETED
      //obj.deletedAt = new Date().getTime()

      const deletedObj = await this.update(obj)

      return deletedObj
   }

   async hardDelete(uid: string) {
      const dataObject = await this.getDataObjectFromUid(uid)

      await this.backendAdapter.delete(dataObject)
   }

   async query(query: Query<typeof BaseObject>): Promise<Payload<T>> {
      const rawItems = await this.backendAdapter.query(query)

      const items = rawItems.map((item) => {
         return this.model.instantiateFromDataObject(item) as T
      })

      const meta: Meta = {
         count: items.length,
         updatedAt: new Date().getTime(),
      }

      const payload: Payload<T> = { items, meta }

      return payload
   }
}
