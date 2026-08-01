import { Core } from '@quatrain/core'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { Specification } from './Specification'
import { Vendor } from './Vendor'
import { ObjectVendor } from './ObjectVendor'

/**
 * Type alias for concrete AbstractMdmObject child class constructor
 */
export type MdmObjectConstructor<T extends AbstractMdmObject> = (typeof AbstractMdmObject) & {
   new (dao: any): T
   fromObject: (data: any) => T
}

/**
 * Abstract Adapter for MDM Providers.
 * Declares contracts for object CRUD, archetype specs, specifications read/write, and vendor relationships.
 */
export abstract class AbstractMdmAdapter extends Core {
   protected _alias: string = 'default'

   constructor(alias: string = 'default') {
      super()
      this._alias = alias
   }

   get alias(): string {
      return this._alias
   }

   abstract registerArchetype(archetype: MdmArchetypeSpec): Promise<void>
   abstract getArchetype(archetypeId: string): Promise<MdmArchetypeSpec | null>
   abstract createObject<T extends AbstractMdmObject>(modelClass: MdmObjectConstructor<T>, data: Record<string, unknown>): Promise<T>
   abstract getObject<T extends AbstractMdmObject>(modelClass: MdmObjectConstructor<T>, uid: string): Promise<T | null>

   /**
    * Persists or updates an individual Specification instance for an MDM Object.
    */
   abstract saveSpecification(object: AbstractMdmObject, spec: Specification): Promise<Specification>

   /**
    * Persists or updates an array of Specification instances for an MDM Object.
    */
   abstract saveSpecifications(object: AbstractMdmObject, specs: Specification[]): Promise<Specification[]>

   /**
    * Reads all attached Specification instances for an MDM Object.
    */
   abstract getSpecifications(object: AbstractMdmObject): Promise<Specification[]>

   /**
    * Persists or updates a Vendor entity.
    */
   abstract saveVendor(vendor: Vendor): Promise<Vendor>

   /**
    * Reads a Vendor entity by identifier.
    */
   abstract getVendor(vendorId: string): Promise<Vendor | null>

   /**
    * Associates a Vendor entity to an MDM Object via an ObjectVendor relationship record.
    */
   abstract attachVendor(object: AbstractMdmObject, vendor: Vendor, vendorSku?: string, role?: string, isPrimary?: boolean): Promise<ObjectVendor>

   /**
    * Reads all ObjectVendor relationship instances attached to an MDM Object.
    */
   abstract getObjectVendors(object: AbstractMdmObject): Promise<ObjectVendor[]>

   /**
    * Reads all Vendor entities attached to an MDM Object.
    */
   abstract getVendors(object: AbstractMdmObject): Promise<Vendor[]>
}
