import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'

/**
 * Interface representing Vendor & Stock Keeping Unit (SKU) details
 */
export interface VendorInfoInterface {
   vendor?: string
   vendorSku?: string
}

/**
 * Abstract Base Class for all MDM Domain Objects.
 * MUST be extended by concrete object definitions (e.g. TeeShirt, Garment, Disk, HardwareDevice, VirtualKeychain).
 * 
 * Properties:
 * - `id`: Backend primary identifier (provided via ObjectUri).
 * - `name`: Human-readable object name.
 * - `sku`: Internal Stock Keeping Unit (SKU).
 * - `vendor`: Vendor, Manufacturer, or Brand name.
 * - `vendorSku`: Vendor-specific SKU or Part Number.
 * - `archetypeId`: Identifier of the associated archetype schema.
 * - `nature`: Classification ('physical', 'virtual', 'service', 'composite').
 * - `lifecycleState`: Lifecycle status state.
 * - `parentId`: Identifier of parent object if nested/attached.
 * - `specifications`: Specific archetype properties payload.
 */
export abstract class AbstractMdmObject extends PersistedBaseObject {
   static COLLECTION = 'objects'
   static PROPS_DEFINITION = [
      { name: 'id', type: 'string', required: false },
      { name: 'name', type: 'string', required: true },
      { name: 'sku', type: 'string', required: false },
      { name: 'vendor', type: 'string', required: false },
      { name: 'vendorSku', type: 'string', required: false },
      { name: 'archetypeId', type: 'string', required: true },
      { name: 'nature', type: 'string', required: true, default: 'physical' },
      { name: 'lifecycleState', type: 'string', required: true, default: 'AVAILABLE' },
      { name: 'parentId', type: 'string', required: false },
      { name: 'specifications', type: 'object', required: false, default: {} },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }

   /**
    * Returns the vendor information object
    */
   public get vendorInfo(): VendorInfoInterface {
      return {
         vendor: this.dataObject.val('vendor'),
         vendorSku: this.dataObject.val('vendorSku'),
      }
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
    * Returns the subcollection path for attaching N child subitems linked to this parent object.
    * Scheme: <COLLECTION>/<id>/<subcollection>
    */
   public getSubcollectionName(subcollection: string): string {
      const id =
         this.dataObject.val('id') ||
         this.dataObject.uid ||
         (this.dataObject.uri ? this.dataObject.uri.path.split('/').pop() : '') ||
         ''
      const collectionName = (this.constructor as typeof AbstractMdmObject).COLLECTION
      return `${collectionName}/${id}/${subcollection}`
   }
}

/**
 * Base Repository for AbstractMdmObject child models
 */
export class AbstractMdmObjectRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'objects'
}
