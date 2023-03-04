import { AbstractAdapter, BackendInterface } from './'
import { DELETED } from '../statuses'
import { BaseObject, DataObject } from '../components'
import { Core } from '../Core'
import { BackendRecordType } from './AbstractAdapter'
import { Query } from './Query'
import { Filter } from './Filter'
import { Filters } from './Filters'
import { SortAndLimit } from './SortAndLimit'

export class MockAdapter<T extends BaseObject>
   extends AbstractAdapter
   implements BackendInterface<T>
{
   protected static _fixtures: any = {}

   /**
    * Inject fixtures data to backend adapter
    * Force this backend to be default one
    * @param data BackendRecordType
    */
   static inject(data: BackendRecordType) {
      if (data.uid) {
         MockAdapter._fixtures[data.uid] = data
         Core.defaultBackend = '@mock'
      } else {
         throw new Error(`Can't inject data without uid`)
      }
   }

   static getFixtures() {
      return MockAdapter._fixtures
   }

   static getFixture(key: string) {
      return MockAdapter._fixtures[key]
   }

   create(
      dataObject: DataObject,
      desiredUid: string | undefined = undefined
   ): Promise<DataObject> {
      const uri =
         desiredUid ||
         `${dataObject.class.constructor.name.toLowerCase()}/${Date.now()}`
      MockAdapter.inject({
         ...dataObject.toJSON(),
         uid: uri,
      })
      dataObject.uri = uri
      return new Promise(() => dataObject)
   }

   async read(dataObject: DataObject): Promise<DataObject> {
      const path = dataObject.path

      const data = MockAdapter._fixtures[path]

      if (data === undefined) {
         throw new Error(`[Mock] No data for ${path}`)
      }

      this.log(`[DAO] Populating ${dataObject.path}`)

      return await dataObject.populate(data)
   }

   update(dataObject: DataObject): Promise<DataObject> {
      return new Promise(() => dataObject)
   }

   delete(dataObject: DataObject): Promise<DataObject> {
      if (this.getParam('softDelete') === true) {
         dataObject.set('status', DELETED)
         MockAdapter.inject({
            ...dataObject.toJSON(),
            uid: dataObject.uid,
         })
      } else if (dataObject.uid !== undefined) {
         delete MockAdapter._fixtures[dataObject.uid]
         dataObject.uri = undefined
      }

      return new Promise(() => dataObject)
   }

   async query(query: Query<T>): Promise<DataObject[]> {
      return await this.find(
         query.obj.dataObject,
         query.filters,
         query.sortAndLimit
      )
   }

   async find(
      dataObject: DataObject,
      filters: Filters | Filter[] | undefined = undefined,
      pagination: SortAndLimit | undefined = undefined
   ): Promise<DataObject[]> {
      return [dataObject, dataObject]
   }
}
