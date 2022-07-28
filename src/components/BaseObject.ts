import { DataObject, ObjectUri, Property, statuses } from '..'
import { DataObjectProperties } from '../properties'

export const BaseObjectProperties: DataObjectProperties = [
   {
      name: 'name',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
   },
   {
      name: 'status',
      mandatory: true,
      type: Property.TYPE_ENUM,
      values: [
         statuses.CREATED,
         statuses.PENDING,
         statuses.ACTIVE,
         statuses.DELETED,
      ],
      defaultValue: statuses.CREATED,
   },
]

export class BaseObject {
   static PROPS_DEFINITION = BaseObjectProperties
   protected _dataObject: DataObject

   protected constructor(dao: DataObject) {
      this._dataObject = dao
   }

   get(key: string) {
      return this._dataObject.get(key)
   }

   set(key: string, val: any) {
      return this._dataObject.set(key, val)
   }

   val(key: string) {
      return this.get(key).val()
   }

   get backend() {
      return this._dataObject.backend
   }

   get path(): string {
      return this._dataObject.path
   }

   get status(): string {
      return this._dataObject.get('status')
   }

   set status(status: string) {
      this._dataObject.set('status', status)
   }

   get uid() {
      return this._dataObject.uid
   }

   async save(uid: string | undefined = undefined) {
      return await this._dataObject.save(uid)
   }

   static async factory(uri: string | ObjectUri | undefined = undefined) {
      try {
         const dao = await DataObject.factory(this, this.PROPS_DEFINITION)
         if (uri) {
            dao.uri = uri
            await dao.populate()
         }
         return new this(dao)
      } catch (err) {
         console.log((err as Error).message)
         throw new Error(`Unable to build instance for '${this.constructor.name}': ${(err as Error).message}`)
      }
   }
}
