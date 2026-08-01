import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { StringProperty, ObjectProperty, Core } from '@quatrain/core'

/**
 * Extensible Vendor model class representing a supplier, manufacturer, distributor, or brand.
 * Inherits from Quatrain Core `PersistedBaseObject`.
 */
export class Vendor extends PersistedBaseObject {
   static COLLECTION = 'vendors'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, required: true },
      { name: 'vendorSku', type: StringProperty.TYPE, required: false },
      { name: 'role', type: StringProperty.TYPE, required: false, default: 'supplier' },
      { name: 'url', type: StringProperty.TYPE, required: false },
      { name: 'details', type: 'object', required: false, default: {} },
      { name: 'parent', type: ObjectProperty.TYPE, instanceOf: 'AbstractMdmObject', required: false },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('Vendor', Vendor)

/**
 * Repository for Vendor subcollection items
 */
export class VendorRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'vendors'
}
