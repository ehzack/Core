import { PersistedBaseObject, DataObjectClass, BaseRepository } from '@quatrain/backend'
import { StringProperty, BooleanProperty, ObjectProperty, Core } from '@quatrain/core'

/**
 * Class representing an individual MDM Object Specification entry.
 * Inherits from Quatrain Core `PersistedBaseObject`.
 */
export class Specification extends PersistedBaseObject {
   static COLLECTION = 'specifications'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, required: true },
      { name: 'key', type: StringProperty.TYPE, required: true },
      { name: 'value', type: 'any', required: true },
      { name: 'unit', type: StringProperty.TYPE, required: false },
      { name: 'group', type: StringProperty.TYPE, required: false },
      { name: 'isRequired', type: BooleanProperty.TYPE, required: false, default: false },
      { name: 'parent', type: ObjectProperty.TYPE, instanceOf: 'AbstractMdmObject', required: false },
   ]

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }

   get key(): string {
      return this.dataObject.val('key') || this.dataObject.val('name')
   }

   get value(): any {
      return this.dataObject.val('value')
   }

   get unit(): string | undefined {
      return this.dataObject.val('unit')
   }

   get group(): string | undefined {
      return this.dataObject.val('group')
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('Specification', Specification)

/**
 * Repository for Specification subcollection items
 */
export class SpecificationRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'specifications'
}
