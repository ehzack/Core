import { PersistedBaseObject, DataObjectClass, BaseRepository, CollectionProperty } from '@quatrain/backend'
import { StringProperty, ObjectProperty, Core } from '@quatrain/core'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { Specification } from './Specification'
import { Vendor } from './Vendor'

/**
 * Abstract Base Class for all MDM Domain Objects.
 * MUST be extended by concrete object definitions (e.g. TeeShirt, Garment, Disk, HardwareDevice, VirtualKeychain).
 * 
 * Note: Persistence routing and identification are natively carried by Quatrain `ObjectUri` (no explicit 'id' property in PROPS_DEFINITION).
 * Specifications and Vendors are managed as child collections of `Specification` and `Vendor` instances.
 * Property access uses native `PersistedBaseObject.val('propName')`.
 */
export abstract class AbstractMdmObject extends PersistedBaseObject {
   static COLLECTION = 'objects'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, required: true },
      { name: 'sku', type: StringProperty.TYPE, required: false },
      { name: 'archetypeId', type: StringProperty.TYPE, required: true },
      { name: 'nature', type: StringProperty.TYPE, required: true, default: 'physical' },
      { name: 'lifecycleState', type: StringProperty.TYPE, required: true, default: 'AVAILABLE' },
      { name: 'parent', type: ObjectProperty.TYPE, instanceOf: 'AbstractMdmObject', required: false },
      {
         name: 'specifications',
         type: CollectionProperty.TYPE,
         instanceOf: Specification,
         parentKey: 'parent',
      },
      {
         name: 'vendors',
         type: CollectionProperty.TYPE,
         instanceOf: Vendor,
         parentKey: 'parent',
      },
   ]

   protected _specificationsMap: Map<string, Specification> = new Map()
   protected _vendorsList: Vendor[] = []

   constructor(dao: DataObjectClass<any>) {
      super(dao)
   }

   /**
    * Abstract method defining the specific archetype specification schema for this object class.
    * Must declare required and optional specification keys.
    */
   abstract getArchetypeSpec(): MdmArchetypeSpec

   /**
    * Adds a Vendor instance to this object's vendors collection.
    */
   public addVendor(vendor: Vendor): this {
      this._vendorsList.push(vendor)
      return this
   }

   /**
    * Creates and attaches a new Vendor to this object.
    */
   public createVendor(name: string, vendorSku?: string, role?: string, details?: Record<string, any>): Vendor {
      const vendor = Vendor.fromObject({
         name,
         vendorSku,
         role: role || 'supplier',
         details: details || {},
         parent: this,
      })
      this.addVendor(vendor)
      return vendor
   }

   /**
    * Retrieves all attached Vendor instances.
    */
   public getVendors(): Vendor[] {
      return this._vendorsList
   }

   /**
    * Returns the subcollection path for Specifications attached to this parent object.
    * Scheme: <COLLECTION>/<uri_path>/specifications
    */
   public get specificationsCollectionName(): string {
      const uriPath = this.dataObject.uri ? this.dataObject.uri.path : this.dataObject.uid || ''
      const collectionName = (this.constructor as typeof AbstractMdmObject).COLLECTION
      return `${collectionName}/${uriPath}/specifications`
   }

   /**
    * Adds an individual Specification instance to this object.
    */
   public addSpecification(spec: Specification): this {
      const key = spec.val('key') || spec.val('name')
      this._specificationsMap.set(key, spec)
      return this
   }

   /**
    * Sets a specification key/value pair by instantiating a Specification model.
    */
   public setSpecification(key: string, value: any, unit?: string, group?: string): Specification {
      const spec = Specification.fromObject({
         name: key,
         key,
         value,
         unit,
         group,
         parent: this,
      })
      this._specificationsMap.set(key, spec)
      return spec
   }

   /**
    * Bulk populates specifications from a dictionary object.
    */
   public setSpecificationsFromObject(specsObj: Record<string, any>): this {
      for (const [key, value] of Object.entries(specsObj)) {
         this.setSpecification(key, value)
      }
      return this
   }

   /**
    * Retrieves a Specification instance by key.
    */
   public getSpecification(key: string): Specification | undefined {
      return this._specificationsMap.get(key)
   }

   /**
    * Retrieves all Specification instances as an array.
    */
   public getSpecifications(): Specification[] {
      return Array.from(this._specificationsMap.values())
   }

   /**
    * Returns a plain key-value object of all specifications for interface casting and validation.
    */
   public get specificationsObject(): Record<string, any> {
      const result: Record<string, any> = {}
      for (const [key, spec] of this._specificationsMap.entries()) {
         result[key] = spec.val('value')
      }
      return result
   }

   /**
    * Validates that the current instance specifications comply with the archetype's required and optional properties.
    * @returns True if valid; throws error if required specification properties are missing.
    */
   public validateArchetypeSpecs(): boolean {
      const specDef = this.getArchetypeSpec()
      const specsObj = this.specificationsObject

      if (specDef.requiredProperties) {
         for (const reqProp of specDef.requiredProperties) {
            if (specsObj[reqProp] === undefined || specsObj[reqProp] === null) {
               throw new Error(
                  `MdmValidationError: Missing required archetype specification '${reqProp}' on object '${this.val('name')}' (Archetype: '${specDef.archetypeId}')`
               )
            }
         }
      }
      return true
   }

   /**
    * Returns the subcollection path for attaching N child subitems linked to this parent object.
    * Scheme: <COLLECTION>/<uri_path>/<subcollection>
    */
   public getSubcollectionName(subcollection: string): string {
      const uriPath = this.dataObject.uri ? this.dataObject.uri.path : this.dataObject.uid || ''
      const collectionName = (this.constructor as typeof AbstractMdmObject).COLLECTION
      return `${collectionName}/${uriPath}/${subcollection}`
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('AbstractMdmObject', AbstractMdmObject)

/**
 * Base Repository for AbstractMdmObject child models
 */
export class AbstractMdmObjectRepository extends BaseRepository<any> {
   public static readonly COLLECTION_NAME = 'objects'
}
