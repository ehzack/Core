import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { StringProperty, BooleanProperty, ObjectProperty, Core } from '@quatrain/core'
import { Vendor } from './Vendor'

/**
 * Junction entity carrying the relationship between an MDM Object and a Vendor.
 * Stores object-vendor specific metadata (vendorSku, role, primary flag).
 */
export class ObjectVendor extends PersistedBaseObject {
   static COLLECTION = 'object_vendors'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, required: false },
      { name: 'object', type: ObjectProperty.TYPE, instanceOf: 'AbstractMdmObject', required: true },
      { name: 'vendor', type: ObjectProperty.TYPE, instanceOf: Vendor, required: true },
      { name: 'vendorSku', type: StringProperty.TYPE, required: false },
      { name: 'role', type: StringProperty.TYPE, required: false, default: 'supplier' },
      { name: 'isPrimary', type: BooleanProperty.TYPE, required: false, default: false },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('ObjectVendor', ObjectVendor)

/**
 * Repository for ObjectVendor relationship records
 */
export class ObjectVendorRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'object_vendors'
}
