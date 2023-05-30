import { AbstractAdapter, BackendInterface } from './AbstractAdapter'
import { DELETED } from '../statuses'
import { ObjectUri } from '../components/ObjectUri'
import { Core } from '../Core'
import { BackendRecordType } from './AbstractAdapter'
import { Filter } from './Filter'
import { Filters } from './Filters'
import { SortAndLimit } from './SortAndLimit'
import { DataObjectClass } from '../components/types/DataObjectClass'
import { faker } from '@faker-js/faker'

export class MockAdapter extends AbstractAdapter implements BackendInterface {
   protected static _fixtures: any = {}

   /**
    * Inject fixtures data to backend adapter
    * @param data BackendRecordType
    */
   static inject(data: BackendRecordType) {
      if (data.path) {
         MockAdapter._fixtures[data.path] = this.dao2backend(data)
      } else {
         throw new Error(`Can't inject data without a path`)
      }
   }

   static dao2backend(data: BackendRecordType): Promise<any> {
      const processed: any = {}
      Object.keys(data).forEach((key: any) => {
         if (
            data[key] !== null &&
            typeof data[key] === 'object' &&
            data[key].name === 'BaseObject'
         ) {
            processed[key] = data[key].dataObject.uri.toReference()
         } else {
            processed[key] = data[key]
         }
      })
      return processed
   }

   static getFixtures(): any[] {
      return MockAdapter._fixtures
   }

   static getFixture(key: string): any {
      return MockAdapter._fixtures[key]
   }

   create(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>> {
      const uri = `${this.getCollection(
         dataObject
      )}/${faker.random.alphaNumeric(12)}`

      dataObject.uri = new ObjectUri(uri)

      return new Promise((resolve, reject) => {
         try {
            MockAdapter.inject({
               ...dataObject.toJSON(),
               uid: uri,
               path: uri,
            })
            resolve(dataObject)
         } catch (err) {
            reject(err)
         }
      })
   }

   async read(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>> {
      const path = dataObject.path

      const data = MockAdapter._fixtures[path]

      if (data === undefined) {
         throw new Error(`[Mock] No data for ${path}`)
      }

      this.log(`[DAO] Populating ${dataObject.path}`)

      return await dataObject.populate(data)
   }

   async update(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>> {
      return new Promise(() => dataObject)
   }

   async delete(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>> {
      if (this.getParam('softDelete') === true) {
         dataObject.set('status', DELETED)
         MockAdapter.inject({
            ...dataObject.toJSON(),
            uid: dataObject.uid,
         })
      } else if (dataObject.uid !== undefined) {
         delete MockAdapter._fixtures[dataObject.uid]
         dataObject.uri = new ObjectUri()
      }

      return new Promise(() => dataObject)
   }

   async deleteCollection(
      collection: string,
      batchSize?: number | undefined
   ): Promise<void> {
      for (let key in MockAdapter._fixtures) {
         if (key.startsWith(`${collection}/`)) {
            delete MockAdapter._fixtures[key]
         }
      }
      return new Promise(() => null)
   }

   async find(
      dataObject: DataObjectClass<any>,
      filters: Filters | Filter[] | undefined = undefined,
      pagination: SortAndLimit | undefined = undefined
   ): Promise<DataObjectClass<any>[]> {
      const limit = pagination?.limits.batch || 1e10
      let result: DataObjectClass<any>[] = []
      const collection = this.getCollection(dataObject)
      // TODO filter only records matchinf collection
      for (let key in MockAdapter.getFixtures()) {
         let keep = true
         if (key.startsWith(`${collection}/`) && result.length <= limit) {
            const dao = await dataObject.clone(MockAdapter.getFixture(key))
            if (filters) {
               if (Array.isArray(filters)) {
                  filters.forEach((filter) => {
                     const prop = dao.get(filter.prop)
                     const val = prop.val()
                     //console.log(filter.prop, prop)
                     if (typeof prop === 'object') {
                        if (prop.constructor.name === 'ObjectProperty') {
                           if (
                              filter.value instanceof ObjectUri &&
                              val &&
                              val.ref !== filter.value.path
                           ) {
                              keep = false
                              return
                           }
                        } else if (
                           prop.constructor.name === 'CollectionProperty'
                        ) {
                           if (
                              filter.value instanceof ObjectUri &&
                              prop.val() !== filter.value.path
                           ) {
                              keep = false
                              return
                           }
                        }
                     } else {
                        if (prop.val() !== filter.value) {
                           keep = false
                           return
                        }
                     }
                  })
               }
            }

            if (keep) {
               dao.uri = new ObjectUri(key)
               result.push(dao)
            }
         }
      }

      if (pagination && pagination.sortings.length > 0) {
         result = result.sort(
            (a: DataObjectClass<any>, b: DataObjectClass<any>) =>
               Number(
                  a.val(pagination.sortings[0].prop) >
                     b.val(pagination.sortings[0].prop)
               )
         )
      }

      return result
   }
}
