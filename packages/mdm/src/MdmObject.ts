import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'

/**
 * Base Persisted Model for all MDM Objects (Physical, Virtual, Service & Composite)
 * Extends Quatrain Core `PersistedBaseObject` to ensure 100% compatibility with backend-* adapters
 * and state-machine transition engines.
 */
export class MdmObject extends PersistedBaseObject {
   static COLLECTION = 'mdm.objects'
   static PROPS_DEFINITION = [
      { name: 'name', type: 'string', required: true },
      { name: 'archetypeId', type: 'string', required: true },
      { name: 'nature', type: 'string', required: true, default: 'physical' },
      { name: 'lifecycleState', type: 'string', required: true, default: 'AVAILABLE' },
      { name: 'parentUid', type: 'string', required: false },
      { name: 'traitsData', type: 'object', required: false, default: {} },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }

   /**
    * Returns the collection name for rattachable N child subcollections
    * Scheme: mdm.objects.<uid>.<subcollection>
    */
   public getSubcollectionName(subcollection: string): string {
      return `${MdmObject.COLLECTION}.${this.dataObject.uid}.${subcollection}`
   }
}

/**
 * Repository facade for MdmObject
 */
export class MdmObjectRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'mdm.objects'
}
