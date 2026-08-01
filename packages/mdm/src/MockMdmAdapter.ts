import { AbstractMdmAdapter, MdmObjectConstructor } from './AbstractMdmAdapter'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { Specification } from './Specification'
import { Vendor } from './Vendor'
import { ObjectVendor } from './ObjectVendor'

/**
 * Mock MDM Adapter for unit testing and offline development
 */
export class MockMdmAdapter extends AbstractMdmAdapter {
   private _archetypes: Map<string, MdmArchetypeSpec> = new Map()
   private _objects: Map<string, AbstractMdmObject> = new Map()
   private _specifications: Map<string, Map<string, Specification>> = new Map() // objKey -> specKey -> Specification
   private _vendors: Map<string, Vendor> = new Map() // vendorId -> Vendor
   private _objectVendors: Map<string, ObjectVendor[]> = new Map() // objKey -> ObjectVendor[]

   private _getObjKey(object: AbstractMdmObject): string {
      return object.dataObject.uri ? object.dataObject.uri.path : object.dataObject.uid || object.val('name')
   }

   async registerArchetype(archetype: MdmArchetypeSpec): Promise<void> {
      this._archetypes.set(archetype.archetypeId, archetype)
   }

   async getArchetype(archetypeId: string): Promise<MdmArchetypeSpec | null> {
      return this._archetypes.get(archetypeId) || null
   }

   async createObject<T extends AbstractMdmObject>(
      modelClass: MdmObjectConstructor<T>,
      data: Record<string, unknown>
   ): Promise<T> {
      const obj = modelClass.fromObject(data)
      const objKey = this._getObjKey(obj)
      if (objKey) {
         this._objects.set(objKey, obj)
      }
      return obj
   }

   async getObject<T extends AbstractMdmObject>(
      modelClass: MdmObjectConstructor<T>,
      uid: string
   ): Promise<T | null> {
      return (this._objects.get(uid) as T) || null
   }

   // --- Specification Read/Write Methods ---

   async saveSpecification(object: AbstractMdmObject, spec: Specification): Promise<Specification> {
      const objKey = this._getObjKey(object)
      if (!this._specifications.has(objKey)) {
         this._specifications.set(objKey, new Map())
      }
      const specKey = spec.val('key') || spec.val('name')
      this._specifications.get(objKey)!.set(specKey, spec)
      object.addSpecification(spec)
      return spec
   }

   async saveSpecifications(object: AbstractMdmObject, specs: Specification[]): Promise<Specification[]> {
      const saved: Specification[] = []
      for (const spec of specs) {
         saved.push(await this.saveSpecification(object, spec))
      }
      return saved
   }

   async getSpecifications(object: AbstractMdmObject): Promise<Specification[]> {
      const objKey = this._getObjKey(object)
      const specsMap = this._specifications.get(objKey)
      if (!specsMap) {
         return object.getSpecifications()
      }
      return Array.from(specsMap.values())
   }

   // --- Vendor & ObjectVendor Read/Write Methods ---

   async saveVendor(vendor: Vendor): Promise<Vendor> {
      const vendorKey = vendor.dataObject.uri ? vendor.dataObject.uri.path : vendor.dataObject.uid || vendor.val('name')
      this._vendors.set(vendorKey, vendor)
      return vendor
   }

   async getVendor(vendorId: string): Promise<Vendor | null> {
      return this._vendors.get(vendorId) || null
   }

   async attachVendor(
      object: AbstractMdmObject,
      vendor: Vendor,
      vendorSku?: string,
      role?: string,
      isPrimary: boolean = false
   ): Promise<ObjectVendor> {
      await this.saveVendor(vendor)
      const ov = object.addVendor(vendor, vendorSku, role, isPrimary)
      const objKey = this._getObjKey(object)
      if (!this._objectVendors.has(objKey)) {
         this._objectVendors.set(objKey, [])
      }
      this._objectVendors.get(objKey)!.push(ov)
      return ov
   }

   async getObjectVendors(object: AbstractMdmObject): Promise<ObjectVendor[]> {
      const objKey = this._getObjKey(object)
      return this._objectVendors.get(objKey) || object.getObjectVendors()
   }

   async getVendors(object: AbstractMdmObject): Promise<Vendor[]> {
      const ovs = await this.getObjectVendors(object)
      return ovs.map((ov) => ov.val('vendor') as Vendor).filter(Boolean)
   }
}
