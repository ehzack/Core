import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'

/**
 * Abstract Base Class for all MDM Domain Objects.
 * MUST be extended by concrete object definitions (e.g. GarmentMdmObject, DiskMdmObject, HardwareDeviceMdmObject).
 */
export abstract class AbstractMdmObject extends PersistedBaseObject {
   static COLLECTION = 'mdm.objects'
   static PROPS_DEFINITION = [
      { name: 'id', type: 'string', required: false },
      { name: 'uid', type: 'string', required: false },
      { name: 'name', type: 'string', required: true },
      { name: 'archetypeId', type: 'string', required: true },
      { name: 'nature', type: 'string', required: true, default: 'physical' },
      { name: 'lifecycleState', type: 'string', required: true, default: 'AVAILABLE' },
      { name: 'parentUid', type: 'string', required: false },
      { name: 'specifications', type: 'object', required: false, default: {} },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }

   /**
    * Abstract method defining the specific archetype specification schema for this object class.
    * Must declare required and optional specification keys.
    */
   abstract getArchetypeSpec(): MdmArchetypeSpec

   /**
    * Validates that the current instance specifications comply with the archetype's required and optional properties.
    * @returns True if valid; throws error if required specification properties are missing.
    */
   public validateArchetypeSpecs(): boolean {
      const specDef = this.getArchetypeSpec()
      const specs = this.dataObject.val('specifications') || {}

      if (specDef.requiredProperties) {
         for (const reqProp of specDef.requiredProperties) {
            if (specs[reqProp] === undefined || specs[reqProp] === null) {
               throw new Error(
                  `MdmValidationError: Missing required archetype specification '${reqProp}' on object '${this.dataObject.val('name')}' (Archetype: '${specDef.archetypeId}')`
               )
            }
         }
      }
      return true
   }

   /**
    * Returns the subcollection name for attaching N child subitems linked to this parent object.
    * Scheme: <COLLECTION>.<uid>.<subcollection>
    */
   public getSubcollectionName(subcollection: string): string {
      const uid =
         this.dataObject.val('uid') ||
         this.dataObject.val('id') ||
         this.dataObject.uid ||
         ''
      const collectionName = (this.constructor as typeof AbstractMdmObject).COLLECTION
      return `${collectionName}.${uid}.${subcollection}`
   }
}

/**
 * Base Repository for AbstractMdmObject child models
 */
export class AbstractMdmObjectRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'mdm.objects'
}
