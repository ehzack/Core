import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { StringProperty, Core } from '@quatrain/core'

/**
 * Top-level Vendor entity representing a manufacturer, supplier, distributor, or brand.
 * Independent entity without parent property (associated to MDM objects via ObjectVendor).
 */
export class Vendor extends PersistedBaseObject {
   static COLLECTION = 'vendors'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, required: true },
      { name: 'sku', type: StringProperty.TYPE, required: false },
      { name: 'url', type: StringProperty.TYPE, required: false },
      { name: 'details', type: 'object', required: false, default: {} },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('Vendor', Vendor)

/**
 * Repository for Vendor entities
 */
export class VendorRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'vendors'
}
