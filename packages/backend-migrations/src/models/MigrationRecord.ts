import { PersistedBaseObject } from '@quatrain/backend'
import { StringProperty } from '@quatrain/core'

/**
 * MigrationRecord Model
 * Stores the state of executed migrations in the target backend.
 */
export class MigrationRecord extends PersistedBaseObject {
   /** The collection name for storing migration logs. */
   static COLLECTION = '_quatrain_migrations'
   
   /** The properties describing a single migration entry. */
   static PROPS_DEFINITION = [
      ...PersistedBaseObject.PROPS_DEFINITION,
      {
         name: 'name',
         type: StringProperty.TYPE,
         mandatory: true,
      }
   ]
}
