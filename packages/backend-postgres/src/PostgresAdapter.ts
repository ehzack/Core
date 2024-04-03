import {
   AbstractAdapter,
   DataObjectClass,
   BackendAction,
   BackendParameters,
   BackendError,
   ObjectUri,
   QueryMetaType,
   QueryResultType,
   Filters,
   Filter,
   SortAndLimit,
   Sorting,
   Core,
   NotFoundError,
   statuses,
   StringProperty,
} from '@quatrain/core'
import { randomUUID } from 'crypto'
import { Client } from 'pg'

const operatorsMap: { [x: string]: string } = {
   equals: '=',
   notEquals: '!=',
   greater: '>',
   greaterOrEquals: '>=',
   lower: '<',
   lowerOrEquals: '>',
   contains: 'in',
   notContains: 'not-in',
   containsAll: 'array-contains',
   containsAny: 'array-contains-any',
}

export class PostgresAdapter extends AbstractAdapter {
   protected _connection: undefined | Client

   constructor(params: BackendParameters = {}) {
      super(params)
   }

   protected async _connect(): Promise<Client> {
      if (!this._connection) {
         const {
            user = '',
            password = '',
            host = 'localhost',
            port = 5432,
            database = 'postgres',
         } = this._params.config
         this._connection = new Client({ host, port, database, user, password })
         await this._connection.connect()
      }

      return this._connection
   }

   /**
    * Process data for compatibility
    * @param data
    * @param filterNulls
    * @returns
    */
   protected _prepareData(data: any, filterNulls = true) {
      if (filterNulls) {
         data = Object.values(data).filter((v) => v !== null)
      } else {
         data = Object.values(data)
      }
      if (
         this._params['useNativeForeignKeys'] &&
         this._params['useNativeForeignKeys'] === true
      ) {
         data.forEach((key: string) => {
            if (typeof data[key] === 'object' && data[key].ref) {
               data.key = data[key].ref.split('/').pop()
            }
         })
      }

      return data
   }

   /**
    * Create record in backend
    * @param dataObject DataObject instance to persist in backend
    * @returns DataObject
    */
   async create(
      dataObject: DataObjectClass<any>,
      desiredUid: string | undefined
   ): Promise<DataObjectClass<any>> {
      return new Promise(async (resolve, reject) => {
         try {
            if (dataObject.uid) {
               throw new BackendError(
                  `Data object already has an uid and can't be created`
               )
            }

            const uid = desiredUid || randomUUID()

            // execute middlewares
            await this.executeMiddlewares(dataObject, BackendAction.CREATE, {
               useDateFormat: true,
            })

            const data = dataObject.toJSON({ withoutURIData: false })

            let query = `INSERT INTO ${dataObject.uri.collection} (id`
            let values = `VALUES ($1`
            let count = 2
            Object.keys(data).forEach((key) => {
               if (data[key] !== null) {
                  query += `, ${key.toLowerCase()}`
                  values += `, $${count++}`
               }
            })

            query += `) `
            values += `)`

            Core.log(`[PGA] ${query}${values}`)
            await this._connect()
            const pgData = [uid, ...this._prepareData(data)]
            await this._connection?.query(`${query}${values}`, pgData)

            dataObject.uri.path = `${dataObject.uri.collection}/${uid}`
            dataObject.uri.label = data && Reflect.get(data, 'name')

            Core.log(
               `[PGA] Saved object "${data.name}" at path ${dataObject.path}`
            )

            resolve(dataObject)
         } catch (err) {
            console.log(err)
            Core.log((err as Error).message)
            reject(new BackendError((err as Error).message))
         }
      })
   }

   async read(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>> {
      const path = dataObject.path

      const parts = path.split('/')
      if (parts.length < 2 || parts.length % 2 !== 0) {
         throw new BackendError(
            `[PGA] path parts number should be even, received: '${path}'`
         )
      }

      Core.log(`[PGA] Getting document ${path}`)

      await this._connect()

      const query = `SELECT * FROM ${parts[0]} WHERE id = '${parts[1]}'`

      Core.log(`[PGA] ${query}`)

      const result = await this._connection?.query(query)

      if (result?.rowCount === 0) {
         throw new NotFoundError(`[PGA] No document matches path '${path}'`)
      }

      dataObject.populate(result?.rows[0])

      this.executeMiddlewares(dataObject, BackendAction.READ)

      return dataObject
   }

   async update(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>> {
      if (dataObject.uid === undefined) {
         throw Error('DataObject has no uid')
      }

      Core.log(`[PGA] updating document ${dataObject.path}`)

      // execute middlewares
      await this.executeMiddlewares(dataObject, BackendAction.UPDATE)

      const data = dataObject.toJSON({
         objectsAsReferences: true,
         withoutURIData: true,
         ignoreUnchanged: true,
         converters: { datetime: (ts: number) => ts / 1000 },
      })

      const pgData = this._prepareData(data, false)

      let query = `UPDATE ${dataObject.uri.collection} SET `
      let i = 1
      Object.keys(dataObject.properties).forEach((key) => {
         const prop = dataObject.get(key)
         if (!prop.hasChanged) return
         query += `${i > 1 ? ', ' : ''}${key.toLowerCase()} = `
         if (prop.constructor.name === 'DateTimeProperty') {
            query += `to_timestamp($${i})`
         } else {
            query += `$${i}`
         }
         i++
      })

      query += ` WHERE id = '${dataObject.uid}'`

      Core.log(`[PGA] ${query}`)
      await this._connect()
      await this._connection?.query(query, pgData)

      return dataObject
   }

   async delete(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>> {
      if (dataObject.uid === undefined) {
         throw new BackendError('Dataobject has no uid')
      }

      // execute middlewares
      await this.executeMiddlewares(dataObject, BackendAction.DELETE, {
         useDateFormat: true,
      })

      await this._connect()

      if (this._params.softDelete === true) {
         dataObject.set('status', statuses.DELETED)
         let query = `UPDATE ${dataObject.uri.collection} SET status = $1 WHERE id = $2`
         await this._connection?.query(query, [
            statuses.DELETED,
            dataObject.uid,
         ])
      } else {
         await this._connection?.query(
            `DELETE FROM ${dataObject.uri.collection} WHERE id = $1`,
            [dataObject.uid]
         )
      }

      dataObject.uri = new ObjectUri()

      return dataObject
   }

   async deleteCollection(collection: string, batchSize = 500): Promise<void> {
      Core.log(`Deleting all records from collection '${collection}'`)
      await this._connect()
      await this._connection?.query(`TRUNCATE TABLE ${collection}`)
   }

   /**
    * Execute a query on a collection
    * @param dataObject
    * @param filters
    * @param pagination
    * @params parent
    * @returns
    */
   async find(
      dataObject: DataObjectClass<any>,
      filters: Filters | Filter[] | undefined = undefined,
      pagination: SortAndLimit | undefined = undefined,
      parent: any = undefined
   ): Promise<QueryResultType<DataObjectClass<any>>> {
      try {
         //  use parent path to start fullPath, if available
         let fullPath = parent ? `${parent.path}/` : ''
         if (dataObject.path && dataObject.path !== ObjectUri.DEFAULT) {
            fullPath += `${dataObject.path}/`
         }
         const collection = this.getCollection(dataObject)

         if (!collection) {
            throw new BackendError(
               `[PGA] Can't find collection matching object to query`
            )
         }

         Core.log(`[PGA] Query on ${collection}`)

         let hasFilters = false
         const query: string[] = []
         query.push(`SELECT * FROM ${collection}`)

         if (filters instanceof Filters) {
            hasFilters = true
         } else if (Array.isArray(filters)) {
            // list of filters objects
            filters.forEach((filter, i) => {
               query.push(i > 0 ? 'AND' : 'WHERE')
               let realProp: any = filter.prop
               let realOperator: string
               let realValue = filter.value

               if (filter.prop === 'keywords') {
                  realProp = '('
                  realOperator = ''
                  realValue = `%${filter.value}%`
                  const props = dataObject.getProperties(StringProperty.name)
                  Object.keys(props).forEach(
                     (rp, j) =>
                        (realProp += `${
                           j > 0 ? ' OR ' : ''
                        }${rp.toLowerCase()} ILIKE '${realValue}'`)
                  )
                  realProp += ')'
                  realValue = undefined
               } else if (
                  filter.prop !== AbstractAdapter.PKEY_IDENTIFIER &&
                  !dataObject.has(filter.prop)
               ) {
                  throw new BackendError(
                     `[PGA] No such property '${filter.prop}' on object'`
                  )
               } else if (filter.prop === AbstractAdapter.PKEY_IDENTIFIER) {
                  realProp = 'id'
                  realOperator = operatorsMap[filter.operator]
               } else {
                  const property = dataObject.get(filter.prop)

                  if (property.constructor.name === 'ObjectProperty') {
                     realProp = `${filter.prop}.ref`

                     if (filter.value instanceof ObjectUri) {
                        realValue = filter.value.path
                     } else {
                        realValue =
                           (filter.value &&
                              filter.value.uri &&
                              filter.value.uri.path) ||
                           filter.value
                     }
                  }
                  realOperator = operatorsMap[filter.operator]
               }

               query.push(
                  `${realProp} ${realOperator} ${
                     realValue !== undefined ? `'${realValue}'` : ''
                  }`
               )

               Core.log(
                  `[PGA] Filter added: ${realProp} ${realOperator} ${realValue}`
               )
            })
         }

         Core.log(`[PGA] ${query.join(' ')}`)

         await this._connect()
         const countSnapshot = await this._connection?.query(
            `${query.join(' ').replace('*', 'COUNT(*) as total')}`
         )

         let sortField: string[] = []
         if (pagination) {
            pagination?.sortings.forEach((sorting: Sorting, i) => {
               query.push(i == 0 ? `ORDER BY` : ',')

               query.push(`${sorting.prop} ${sorting.order}`)
               sortField.push(`${sorting.prop} ${sorting.order}`)
            })
            if (pagination?.limits.batch !== -1) {
               query.push(`LIMIT ${pagination.limits.batch}`)
            }
            query.push(`OFFSET ${pagination.limits.offset || 0}`)
         }

         const result = await this._connection?.query(`${query.join(' ')}`)

         const meta: QueryMetaType = {
            count: countSnapshot?.rows[0].total,
            offset: pagination?.limits.offset || 0,
            batch: pagination?.limits.batch || 20,
            sortField: sortField.join(', '),
            executionTime: Core.timestamp(),
         }

         const items: DataObjectClass<any>[] = []

         for (const doc of result?.rows || []) {
            const newDataObject: DataObjectClass<any> = await dataObject.clone({
               ...doc,
            })

            let newDataObjectUri = ``
            if (newDataObject.has('parent')) {
               // if data contains a parent, it acts as a base path
               if (
                  !(
                     newDataObject.val('parent') &&
                     newDataObject.val('parent').path
                  )
               ) {
                  throw new BackendError(
                     `DataObject has parent but parent is not persisted`
                  )
               }
               newDataObjectUri = `${newDataObject.get('parent')._value._path}/`
            }

            newDataObjectUri += `${this.getCollection(dataObject)}/${doc.id}`

            newDataObject.uri = new ObjectUri(
               newDataObjectUri,
               newDataObject.val('name')
            )
            this.executeMiddlewares(newDataObject, BackendAction.READ)

            items.push(newDataObject)
         }

         return { items, meta }
      } catch (err) {
         throw new BackendError((err as Error).message)
      }
   }
}
