import { UmzugStorage } from 'umzug'
import { AbstractBackendAdapter } from '@quatrain/backend'
import { MigrationRecord } from './models/MigrationRecord'

/**
 * Storage implementation for `umzug` using the Quatrain backend adapter.
 * Persists migration history directly in the target database using the `MigrationRecord` model.
 */
export class QuatrainMigrationStorage implements UmzugStorage {
   constructor(private adapter: AbstractBackendAdapter) {}

   /**
    * Logs a successful migration execution.
    * 
    * @param params - Contains the name of the migration.
    */
   async logMigration({ name }: { name: string }): Promise<void> {
      try {
         const record = await MigrationRecord.factory()
         record.set('name', name)
         // Assuming adapter.create is available and working. 
         // We might need to ensure the _quatrain_migrations table exists, 
         // but that's handled by Umzug usually, or we can just try to create it if it fails.
         // Actually, wait, Quatrain adapters do not automatically create tables unless _ensureTable is called.
         // For SQLite it does ensureTable on update/create. For Postgres we might need to handle it.
         await this.adapter.create(record.dataObject, undefined)
      } catch (err) {
         console.error(`Failed to log migration ${name}`, err)
         throw err
      }
   }

   /**
    * Removes a migration from the executed log.
    * 
    * @param params - Contains the name of the migration.
    */
   async unlogMigration({ name }: { name: string }): Promise<void> {
      try {
         // Find the record by name
         const record = await MigrationRecord.factory()
         const res = await this.adapter.find(
            record.dataObject, 
            [{ prop: 'name', value: name, operator: 'equals' }], 
            undefined, 
            undefined
         )
         if (res.items.length > 0) {
            await this.adapter.delete(res.items[0])
         }
      } catch (err) {
         console.error(`Failed to unlog migration ${name}`, err)
         throw err
      }
   }

   /**
    * Retrieves the list of all currently executed migrations.
    * 
    * @returns An array of executed migration names.
    */
   async executed(): Promise<string[]> {
      try {
         // Quatrain backends will throw an error if the table does not exist. 
         // We need to catch this gracefully to return an empty array if it's a fresh database.
         const record = await MigrationRecord.factory()
         const res = await this.adapter.find(
            record.dataObject, 
            undefined, 
            undefined, 
            undefined
         )
         return res.items.map(item => item.val('name'))
      } catch (err: any) {
         // If table/collection doesn't exist yet, return empty
         // Usually Postgres throws "relation does not exist", SQLite "no such table"
         if (err.message && (err.message.includes('relation') || err.message.includes('no such table'))) {
            return []
         }
         console.error(`Failed to get executed migrations`, err)
         return []
      }
   }
}
