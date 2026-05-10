import { DataObjectClass } from '../components/types/DataObjectClass'
import { BaseProperty } from './BaseProperty'
import { BooleanProperty, BooleanPropertyType } from './BooleanProperty'
import { DateTimeProperty, DateTimePropertyType } from './DateTimeProperty'
import { EnumProperty, EnumPropertyType } from './EnumProperty'
import { HashProperty, HashPropertyType } from './HashProperty'
import { StringProperty, StringPropertyType } from './StringProperty'
import { NumberProperty, NumberPropertyType } from './NumberProperty'
import { ObjectProperty, ObjectPropertyType } from './ObjectProperty'
import { CollectionProperty } from './CollectionProperty'
import { ArrayProperty } from './ArrayProperty'
import { MapProperty } from './MapProperty'
import { FileProperty, FilePropertyType } from './FileProperty'

/**
 * A central factory class for instantiating property objects dynamically based on a configuration payload.
 * It routes property definitions to their respective concrete classes.
 */
export class Property {
   /** Identifier for the `BaseProperty` class. */
   static TYPE_ANY = 'any'
   /** Identifier for the `NumberProperty` class. */
   static TYPE_NUMBER = 'number'
   /** Identifier for the `StringProperty` class. */
   static TYPE_STRING = 'string'
   /** Identifier for the `ObjectProperty` class. */
   static TYPE_OBJECT = 'object'
   /** Identifier for the `EnumProperty` class. */
   static TYPE_ENUM = 'enum'
   /** Identifier for the `BooleanProperty` class. */
   static TYPE_BOOLEAN = 'boolean'
   /** Identifier for the `HashProperty` class. */
   static TYPE_HASH = 'hash'
   /** Identifier for the `DateTimeProperty` class. */
   static TYPE_DATETIME = 'datetime'
   /** Identifier for the `ArrayProperty` class. */
   static TYPE_ARRAY = 'array'
   /** Identifier for the `MapProperty` class. */
   static TYPE_MAP = 'map'
   /** Identifier for the `FileProperty` class. */
   static TYPE_FILE = 'file'

   /**
    * Dynamically creates a concrete Property instance based on the provided configuration.
    * Uses the `type` field to route to the correct subclass constructor.
    * 
    * @param params - A comprehensive dictionary covering parameters for all possible property types. Must include `type`.
    * @param parent - The parent `DataObjectClass` attaching this property.
    * @returns The instantiated concrete property class (e.g. `StringProperty`, `NumberProperty`).
    * @throws {Error} If the specified property type is unknown or missing required fields.
    */
   static factory(
      params: ObjectPropertyType &
         StringPropertyType &
         NumberPropertyType &
         EnumPropertyType &
         BooleanPropertyType &
         HashPropertyType &
         DateTimePropertyType &
         FilePropertyType,
      parent: DataObjectClass<any>
   ) {
      params.parent = parent
      switch (params.type) {
         case BaseProperty.TYPE:
            return new BaseProperty(params)

         case StringProperty.TYPE:
            return new StringProperty(params)

         case NumberProperty.TYPE:
            return new NumberProperty(params)

         case ObjectProperty.TYPE:
            return new ObjectProperty(params)

         case EnumProperty.TYPE:
            return new EnumProperty(params)

         case BooleanProperty.TYPE:
            return new BooleanProperty(params)

         case HashProperty.TYPE:
            return new HashProperty(params)

         case DateTimeProperty.TYPE:
            return new DateTimeProperty(params)

         case CollectionProperty.TYPE:
            if (!('instanceOf' in params)) {
               throw new Error('Missing property instanceOf!')
            }

            return new CollectionProperty(params as any)

         case ArrayProperty.TYPE:
            return new ArrayProperty(params)

         case MapProperty.TYPE:
            return new MapProperty(params)

         case FileProperty.TYPE:
            return new FileProperty(params)

         default:
            throw new Error(`Unknown property type ${params.type}`)
      }
   }
}
