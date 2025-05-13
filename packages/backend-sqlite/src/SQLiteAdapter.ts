import {
   ObjectUri,
   NotFoundError,
   statuses,
   StringProperty,
   ObjectProperty,
} from '@quatrain/core'
import {
   DataObjectClass,
   Backend,
   AbstractBackendAdapter,
   BackendAction,
   BackendParameters,
   BackendError,
   QueryMetaType,
   QueryResultType,
   Filters,
   Filter,
   SortAndLimit,
   Sorting,
   CollectionHierarchy,
} from '@quatrain/backend'
import { randomUUID } from 'crypto'
import sqlite3, { Statement } from 'sqlite3'
import { open, Database } from 'sqlite'
import { AbstractPropertyType } from '@quatrain/core/lib/properties/types/AbstractPropertyType'

const operatorsMap: { [x: string]: string } = {
   equals: '=',
   notEquals: '!=',
   greater: '>',
   greaterOrEquals: '>=',
   lower: '<',
   lowerOrEquals: '<=', // Corrected from '>' in PostgreSQL implementation
   contains: 'IN',
   notContains: 'NOT IN',
   containsAll: 'JSON_ARRAY_CONTAINS', // Custom function to be implemented
   containsAny: 'JSON_ARRAY_ANY', // Custom function to be implemented
}

/**
 * SQLite Backend Adapter for Quatrain
 */
export class SQLiteAdapter extends AbstractBackendAdapter {
   protected _connection: undefined | Database<sqlite3.Database>
   protected _dbPath: string

   constructor(params: BackendParameters = {}) {
      super(params)
      this._dbPath = (params.config?.database as string) || ':memory:'
   }

   protected _buildPath(dataObject: DataObjectClass<any>, uid?: string) {
      const collection = this.getCollection(dataObject)
      if (!collection) {
         throw new BackendError(
            `[SQLA] Can't define record path without a collection name`
         )
      }

      // define document path
      let path = `${collection}/${uid}`
      if (
         this._params.hierarchy &&
         this._params.hierarchy[collection] ===
            CollectionHierarchy.SUBCOLLECTION &&
         dataObject.parentProp &&
         dataObject.has(dataObject.parentProp) &&
         dataObject.val(dataObject.parentProp)
      ) {
         path = `${dataObject.val(dataObject.parentProp).path}/${path}`
      }

      Backend.log(`[SQLA] Record path is '${path}'`)

      return path
   }

   protected async _connect(): Promise<Database<sqlite3.Database>> {
      if (!this._connection) {
         // Open SQLite database
         this._connection = await open<sqlite3.Database, Statement>({
            filename: this._dbPath,
            driver: sqlite3.Database,
         })

         // Enable foreign keys support
         await this._connection.run('PRAGMA foreign_keys = ON')

         // Configure SQLite to handle JSON arrays and objects
         // Register custom SQL functions for array operations
         // Using the create function API from sqlite3 via db.exec
         await this._connection.exec(`
             CREATE FUNCTION JSON_ARRAY_CONTAINS(array, value) 
             RETURNS INTEGER AS 
             BEGIN
                RETURN CASE 
                   WHEN json_valid(array) AND (
                      SELECT COUNT(*) 
                      FROM json_each(array) 
                      WHERE value LIKE '%' || json_each.value || '%'
                   ) = (
                      SELECT COUNT(*) 
                      FROM (
                         SELECT value FROM json_each(json_array(value))
                      )
                   )
                THEN 1
                ELSE 0
                END;
             END;
          `)

         await this._connection.exec(`
             CREATE FUNCTION JSON_ARRAY_ANY(array, value) 
             RETURNS INTEGER AS 
             BEGIN
                RETURN CASE 
                   WHEN json_valid(array) AND (
                      SELECT COUNT(*) 
                      FROM json_each(array) 
                      WHERE value LIKE '%' || json_each.value || '%'
                   ) > 0
                THEN 1
                ELSE 0
                END;
             END;
          `)
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
         data = Object.entries(data)
            .filter(([_, v]) => v !== null && v !== '')
            .map(([_, v]) => v)
      } else {
         data = Object.values(data)
      }

      // Handle arrays by converting them to JSON strings for SQLite
      data.forEach((el: any, key: number) => {
         if (Array.isArray(el)) {
            data[key] = JSON.stringify(el)
         }
      })

      if (
         this._params['useNativeForeignKeys'] &&
         this._params['useNativeForeignKeys'] === true
      ) {
         data.forEach((el: any, key: number) => {
            if (
               typeof el === 'object' &&
               el !== null &&
               Reflect.has(el, 'ref')
            ) {
               const resourcePart = el.ref.split('/').pop()
               if (resourcePart.indexOf('.') === -1) {
                  // convert reference for database objects only
                  data[key] = el.ref.split('/').pop()
               }
            }
         })
      }

      return data
   }

   /**
    * Ensure the collection table exists in SQLite
    * @param dataObject DataObject to create table for
    */
   private async _ensureTable(dataObject: DataObjectClass<any>): Promise<void> {
      const collection = this.getCollection(dataObject)
      if (!collection) {
         throw new BackendError(`[SQLA] Cannot determine collection name`)
      }

      const db = await this._connect()
      const tableExists = await db.get(
         `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
         [collection.toLowerCase()]
      )

      if (!tableExists) {
         // Table doesn't exist, create it
         let query = `CREATE TABLE IF NOT EXISTS ${collection.toLowerCase()} (
             id TEXT PRIMARY KEY`

         // Add columns based on dataObject properties
         Object.entries(dataObject.properties).forEach(
            ([prop, propDef]: [prop: string, propDef: any]) => {
               const propName = prop.toLowerCase()
               let columnType = 'TEXT'

               // Map property types to SQLite column types
               if (propDef.constructor.name === 'NumberProperty') {
                  columnType = 'REAL'
               } else if (propDef.constructor.name === 'BooleanProperty') {
                  columnType = 'INTEGER'
               } else if (propDef.constructor.name === 'DateTimeProperty') {
                  columnType = 'INTEGER' // Store as timestamp
               } else if (propDef.constructor.name === 'ArrayProperty') {
                  columnType = 'TEXT' // Store as JSON string
               } else if (propDef.constructor.name === 'ObjectProperty') {
                  columnType = 'TEXT' // Store reference ID
               }

               query += `,\n${propName} ${columnType}`
            }
         )

         query += `)`
         await db.exec(query)
         Backend.log(`[SQLA] Created table ${collection.toLowerCase()}`)
      }
   }

   /**
    * Create record in backend
    * @param dataObject DataObject instance to persist in backend
    * @param desiredUid Desired unique ID for record
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

            // Make sure table exists
            await this._ensureTable(dataObject)

            // execute middlewares
            await this.executeMiddlewares(dataObject, BackendAction.CREATE, {
               useDateFormat: true,
            })

            const data = dataObject.toJSON({
               withoutURIData: true,
               converters: {
                  datetime: (v: any) => (v ? new Date(v).getTime() : v), // Store as timestamp in SQLite
               },
            })

            const db = await this._connect()
            const collection = this.getCollection(dataObject)

            let columns = ['id']
            let placeholders = ['?']
            let values = [uid]

            Object.entries(data).forEach(
               ([key, value]: [key: string, value: any]) => {
                  columns.push(key.toLowerCase())
                  placeholders.push('?')

                  // Convert arrays and objects to JSON strings
                  if (
                     Array.isArray(value) ||
                     (typeof value === 'object' && value !== null)
                  ) {
                     values.push(JSON.stringify(value))
                  } else {
                     values.push(value)
                  }
               }
            )

            const query = `INSERT INTO ${collection?.toLowerCase()} (${columns.join(
               ', '
            )})
                           VALUES (${placeholders.join(', ')})`

            Backend.debug(`[SQLA] ${query}`)
            Backend.debug(`[SQLA] Values ${JSON.stringify(values)}`)

            await db.run(query, values)

            dataObject.uri.path = this._buildPath(dataObject, uid)
            dataObject.uri.label = data && Reflect.get(data, 'name')
            dataObject.isPersisted(true)

            Backend.info(
               `[SQLA] Saved object "${data.name}" at path ${dataObject.path}`
            )

            resolve(dataObject)
         } catch (err) {
            console.error(err)
            Backend.error((err as Error).message)
            reject(new BackendError((err as Error).message))
         }
      })
   }

   async read(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>> {
      const path = dataObject.path
      const collection = this.getCollection(dataObject)

      const parts = path.split('/')
      if (parts.length < 2 || parts.length % 2 !== 0) {
         throw new BackendError(
            `[SQLA] path parts number should be even, received: '${path}'`
         )
      }

      Backend.log(`[SQLA] Getting document ${path}`)

      if (!collection) {
         throw new BackendError(
            `[SQLA] Can't find collection matching object to query`
         )
      }

      const db = await this._connect()
      const uid = parts[parts.length - 1]

      // Ensure table exists
      await this._ensureTable(dataObject)

      const result = await db.get(
         `SELECT * FROM ${collection.toLowerCase()} WHERE id = ?`,
         [uid]
      )

      if (!result) {
         throw new NotFoundError(`[SQLA] No document matches path '${path}'`)
      }

      // Process object references
      for (const prop in dataObject.properties) {
         const propDef = dataObject.properties[prop]

         if (
            propDef.constructor.name === 'ObjectProperty' &&
            propDef.instanceOf
         ) {
            const propValue = result[prop.toLowerCase()]

            if (propValue) {
               const refTable =
                  this._params.mapping &&
                  this._params.mapping[propDef.instanceOf]
                     ? this._params.mapping[propDef.instanceOf]
                     : propDef.instanceOf.COLLECTION

               // Look up the referenced object for its name
               const refObject = await db.get(
                  `SELECT name FROM ${refTable.toLowerCase()} WHERE id = ?`,
                  [propValue]
               )

               if (refObject) {
                  result[prop] = {
                     ref: `${refTable}/${propValue}`,
                     path: `${refTable}/${propValue}`,
                     label: refObject.name || '',
                  }
               }
            }
         } else if (propDef.constructor.name === 'ArrayProperty') {
            // Parse JSON arrays
            try {
               if (result[prop.toLowerCase()]) {
                  result[prop] = JSON.parse(result[prop.toLowerCase()])
               }
            } catch (e) {
               Backend.warn(`[SQLA] Failed to parse array for ${prop}: ${e}`)
            }
         }

         // Normalize property name case
         if (prop.toLowerCase() !== prop) {
            result[prop] = result[prop.toLowerCase()]
         }
      }

      dataObject.populate(result)
      return dataObject
   }

   async update(
      dataObject: DataObjectClass<any>
   ): Promise<DataObjectClass<any>> {
      if (dataObject.uid === undefined) {
         throw new Error('DataObject has no uid')
      }

      Backend.info(`[SQLA] Updating document ${dataObject.path}`)

      // execute middlewares
      await this.executeMiddlewares(dataObject, BackendAction.UPDATE)

      const data = dataObject.toJSON({
         withoutURIData: true,
         ignoreUnchanged: true,
         converters: {
            datetime: (ts: number) => ts, // Store directly as timestamp in SQLite
         },
      })

      if (Object.keys(data).length === 0) {
         Backend.warn('[SQLA] Nothing to update')
         return dataObject
      }

      const db = await this._connect()
      const collection = this.getCollection(dataObject)

      // Ensure table exists
      await this._ensureTable(dataObject)

      let updates: string[] = []
      let values: any[] = []

      Object.entries(dataObject.properties).forEach(
         ([key, prop]: [key: string, prop: any]) => {
            if (prop.hasChanged === true) {
               updates.push(`${key.toLowerCase()} = ?`)

               let value = prop.value

               // Convert arrays and objects to JSON strings
               if (
                  Array.isArray(value) ||
                  (typeof value === 'object' && value !== null)
               ) {
                  value = JSON.stringify(value)
               }

               values.push(value as string | number | boolean)
            }
         }
      )

      if (updates.length === 0) {
         return dataObject
      }

      values.push(dataObject.uid)
      const query = `UPDATE ${collection?.toLowerCase()} SET ${updates.join(
         ', '
      )} WHERE id = ?`

      Backend.debug(`[SQLA] ${query}`)
      Backend.debug(`[SQLA] Values ${JSON.stringify(values)}`)

      await db.run(query, values)
      return dataObject
   }

   async delete(
      dataObject: DataObjectClass<any>,
      hardDelete = false
   ): Promise<DataObjectClass<any>> {
      if (dataObject.uid === undefined) {
         throw new BackendError('Dataobject has no uid')
      }

      const collection = this.getCollection(dataObject)
      if (!collection) {
         throw new BackendError(`[SQLA] Cannot determine collection name`)
      }

      // execute middlewares
      await this.executeMiddlewares(dataObject, BackendAction.DELETE, {
         useDateFormat: true,
      })

      const db = await this._connect()

      if (!hardDelete) {
         dataObject.set('status', statuses.DELETED)
         await db.run(
            `UPDATE ${collection.toLowerCase()} SET status = ? WHERE id = ?`,
            [statuses.DELETED, dataObject.uid]
         )
      } else {
         await db.run(`DELETE FROM ${collection.toLowerCase()} WHERE id = ?`, [
            dataObject.uid,
         ])
      }

      dataObject.uri = new ObjectUri()
      return dataObject
   }

   async deleteCollection(collection: string, batchSize = 500): Promise<void> {
      Backend.log(`Deleting all records from collection '${collection}'`)
      const db = await this._connect()

      // Check if table exists before trying to delete from it
      const tableExists = await db.get(
         `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
         [collection.toLowerCase()]
      )

      if (tableExists) {
         await db.run(`DELETE FROM ${collection.toLowerCase()}`)
      }
   }

   /**
    * Convert array into SQL expression
    * @param from Array of strings or numbers
    * @returns string
    */
   protected _array2String(from: (string | number)[]) {
      // For SQLite, we'll use the JSON functions to check arrays
      return `'${JSON.stringify(from)}'`
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
      parent: DataObjectClass<any> | undefined = undefined
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
               `[SQLA] Can't find collection matching object to query`
            )
         }

         Backend.debug(`[SQLA] Preparing query on '${collection}'`)

         const db = await this._connect()

         // Ensure table exists
         await this._ensureTable(dataObject)

         let hasFilters = false
         const query: string[] = []
         const params: any[] = []
         const joinTables: { [key: string]: { table: string; alias: string } } =
            {}

         query.push(`SELECT * FROM ${collection.toLowerCase()}`)

         // Add joins for object references
         Object.entries(dataObject.properties).forEach(
            ([prop, propDef]: [prop: string, propDef: any]) => {
               if (
                  propDef.constructor.name === 'ObjectProperty' &&
                  propDef.instanceOf
               ) {
                  const propName = prop.toLowerCase()
                  const joinAlias = `${propName}_table`

                  const table =
                     this._params.mapping &&
                     this._params.mapping[propDef.instanceOf]
                        ? this._params.mapping[propDef.instanceOf]
                        : propDef.instanceOf.COLLECTION

                  joinTables[prop] = { table, alias: joinAlias }

                  query.push(
                     `LEFT JOIN ${table.toLowerCase()} AS ${joinAlias}
                   ON ${joinAlias}.id = ${collection.toLowerCase()}.${propName}`
                  )
               }
            }
         )

         if (parent) {
            query.push(
               `WHERE ${collection.toLowerCase()}.${dataObject.parentProp} = ?`
            )
            params.push(parent.uid)
         }

         //  if (filters instanceof Filters) {
         //     hasFilters = true
         //     // SQLite doesn't support complex Filters object, but we'll mark it as handled
         //  } else if (Array.isArray(filters)) {
         //     // list of filters objects
         //     filters.forEach((filter, i) => {
         //        query.push(parent && i === 0 ? 'AND' : i > 0 ? 'AND' : 'WHERE')

         //        let realProp: any = filter.prop.toLowerCase()
         //        let realOperator: string
         //        let realValue = filter.value

         //        if (filter.prop === 'keywords') {
         //           const keywordFilters: string[] = []
         //           params.push(`%${filter.value}%`)

         //           const props = dataObject.getProperties(StringProperty.name)
         //           Object.keys(props).forEach((rp) => {
         //              keywordFilters.push(
         //                 `${collection.toLowerCase()}.${rp.toLowerCase()} LIKE ?`
         //              )
         //              params.push(`%${filter.value as string}%`)
         //           })

         //           query.push(`(${keywordFilters.join(' OR ')})`)
         //        } else if (
         //           filter.prop !== AbstractBackendAdapter.PKEY_IDENTIFIER &&
         //           !dataObject.has(filter.prop)
         //        ) {
         //           throw new BackendError(
         //              `[SQLA] No such property '${filter.prop}' on object'`
         //           )
         //        } else if (
         //           filter.prop === AbstractBackendAdapter.PKEY_IDENTIFIER
         //        ) {
         //           realProp = 'id'
         //           realOperator = operatorsMap[filter.operator]
         //        } else {
         //           const property = dataObject.get(filter.prop)
         //           realProp = filter.prop.toLowerCase()

         //           if (
         //              property.constructor.name === 'ArrayProperty' &&
         //              Array.isArray(realValue)
         //           ) {
         //              // We use JSON_ARRAY_ANY function for array containment
         //              query.push(
         //                 `JSON_ARRAY_ANY(${collection.toLowerCase()}.${realProp}, ?)`
         //              )
         //              params.push((realValue as string[]).join(','))
         //           } else if (property.constructor.name === 'ObjectProperty') {
         //              if (filter.value instanceof ObjectUri) {
         //                 realValue = filter.value.uid
         //              } else if (
         //                 filter.value &&
         //                 typeof filter.value === 'object' &&
         //                 filter.value.ref
         //              ) {
         //                 realValue = filter.value.ref.split('/')[1]
         //              } else if (typeof filter.value === 'string') {
         //                 const collectionName =
         //                    this._params.mapping &&
         //                    this._params.mapping[
         //                       dataObject.properties[filter.prop].instanceOf
         //                    ]
         //                       ? this._params.mapping[
         //                            dataObject.properties[filter.prop].instanceOf
         //                         ]
         //                       : dataObject.properties[filter.prop].instanceOf
         //                            .COLLECTION
         //                 realValue = filter.value.replace(
         //                    `${collectionName}/`,
         //                    ''
         //                 )
         //              } else {
         //                 realValue =
         //                    (filter.value &&
         //                       filter.value.uri &&
         //                       filter.value.uri.path &&
         //                       filter.value.uri.path.split('/')[1]) ||
         //                    filter.value
         //              }
         //           }

         //           realOperator = operatorsMap[filter.operator]
         //        }

         //        if (realOperator === operatorsMap['containsAny']) {
         //           // Use custom JSON function for array checks
         //           query.push(
         //              `JSON_ARRAY_ANY(${collection.toLowerCase()}.${realProp}, ?)`
         //           )
         //           params.push(realValue)
         //        } else if (
         //           realOperator === operatorsMap['equals'] &&
         //           realValue === 'null'
         //        ) {
         //           query.push(`${collection.toLowerCase()}.${realProp} IS NULL`)
         //        } else if (
         //           realOperator === operatorsMap['contains'] ||
         //           realOperator === operatorsMap['notContains']
         //        ) {
         //           if (Array.isArray(realValue)) {
         //              const placeholders = realValue.map(() => '?').join(', ')
         //              query.push(
         //                 `${collection.toLowerCase()}.${realProp} ${realOperator} (${placeholders})`
         //              )
         //              params.push(...realValue)
         //           } else {
         //              query.push(
         //                 `${collection.toLowerCase()}.${realProp} ${realOperator} (?)`
         //              )
         //              params.push(realValue as string | number)
         //           }
         //        } else {
         //           query.push(
         //              `${collection.toLowerCase()}.${realProp} ${realOperator} ?`
         //           )
         //           params.push(realValue)
         //        }

         //        Backend.debug(
         //           `[SQLA] Filter added: ${realProp} ${realOperator} ${String(
         //              realValue
         //           )}`
         //        )
         //     })
         //  }

         // Count query - without pagination
         const countQuery = query.join(' ').replace('*', 'COUNT(*) as total')
         Backend.debug(`[SQLA] Count SQL ${countQuery}`)

         const countResult = await db.get(countQuery, params)
         const totalCount = countResult ? countResult.total : 0

         Backend.debug(`[SQLA] Counting records ${totalCount}`)

         // Add sorting and pagination
         let sortField: string[] = []
         if (pagination && pagination.sortings) {
            pagination.sortings.forEach((sorting: Sorting, i) => {
               query.push(i === 0 ? `ORDER BY` : ',')
               query.push(
                  `${collection.toLowerCase()}.${sorting.prop.toLowerCase()} ${
                     sorting.order
                  }`
               )
               if (sorting.prop !== undefined) {
                  sortField.push(`${sorting.prop} ${sorting.order}`)
               }
            })

            if (pagination?.limits.batch !== -1) {
               query.push(`LIMIT ?`)
               params.push(pagination.limits.batch)
            }

            if (pagination?.limits.offset) {
               query.push(`OFFSET ?`)
               params.push(pagination.limits.offset)
            }
         }

         const finalQuery = query.join(' ')
         Backend.debug(`[SQLA] Full SQL ${finalQuery}`)
         Backend.debug(`[SQLA] Params ${JSON.stringify(params)}`)

         const results = await db.all(finalQuery, params)

         const meta: QueryMetaType = {
            count: totalCount,
            offset: pagination?.limits.offset || 0,
            batch: pagination?.limits.batch || 20,
            sortField: sortField.join(', '),
            executionTime: Backend.timestamp(),
            debug: { sql: finalQuery, params },
         }

         const items: DataObjectClass<any>[] = []

         for (let doc of results || []) {
            // Process document before populating
            Object.entries(dataObject.properties).forEach(
               ([prop, propDef]: [prop: string, propDef: any]) => {
                  const lcProp = prop.toLowerCase()

                  // Handle ObjectProperty references
                  if (
                     propDef.constructor.name === 'ObjectProperty' &&
                     propDef.instanceOf
                  ) {
                     const refValue = doc[lcProp]
                     if (refValue) {
                        const info = joinTables[prop]
                        const label = doc[`${lcProp}_table_name`] || ''

                        doc[prop] = {
                           ref: `${info.table}/${refValue}`,
                           path: `${info.table}/${refValue}`,
                           label,
                        }
                     }
                  }
                  // Handle array properties
                  else if (propDef.constructor.name === 'ArrayProperty') {
                     try {
                        if (doc[lcProp]) {
                           doc[prop] = JSON.parse(doc[lcProp])
                        }
                     } catch (e) {
                        Backend.warn(
                           `[SQLA] Failed to parse array for ${prop}: ${e}`
                        )
                     }
                  }

                  // Ensure property is available with original case
                  if (prop !== lcProp) {
                     doc[prop] = doc[lcProp]
                  }
               }
            )

            const newDataObject: DataObjectClass<any> = await dataObject.clone({
               ...doc,
            })

            let newDataObjectUri = ``
            if (newDataObject.has('parent')) {
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

            items.push(newDataObject)
         }

         return { items, meta }
      } catch (err) {
         console.error(err)
         throw new BackendError(
            `Query failed for '${dataObject.class.name}': ${
               (err as Error).message
            }`
         )
      }
   }

   /**
    * Close the SQLite connection
    */
   async close(): Promise<void> {
      if (this._connection) {
         await this._connection.close()
         this._connection = undefined
      }
   }
}
