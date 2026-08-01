import { Core } from '@quatrain/core'
import { AbstractMdmAdapter, MdmObjectConstructor } from './AbstractMdmAdapter'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { Specification } from './Specification'
import { Vendor } from './Vendor'
import { ObjectVendor } from './ObjectVendor'

/**
 * MDM Core Pivot Class.
 * Manages global provider adapters, archetypes registry, and custom domain model mappings.
 */
export class Mdm extends Core {
   private static _adapters: Map<string, AbstractMdmAdapter> = new Map()
   private static _defaultAlias: string = 'default'
   private static _archetypes: Map<string, MdmArchetypeSpec> = new Map()
   private static _models: Map<string, MdmObjectConstructor<any>> = new Map()

   /**
    * Register an MDM Provider Adapter under a given alias.
    */
   public static addAdapter(adapter: AbstractMdmAdapter, alias: string = 'default', isDefault: boolean = false): void {
      this._adapters.set(alias, adapter)
      if (isDefault || this._adapters.size === 1) {
         this._defaultAlias = alias
      }
      Core.log(`Registered MDM adapter ${adapter.constructor.name} under alias '${alias}'`, 'Mdm')
   }

   /**
    * Retrieve a registered MDM Provider Adapter.
    */
   public static getAdapter(alias?: string): AbstractMdmAdapter {
      const targetAlias = alias || this._defaultAlias
      const adapter = this._adapters.get(targetAlias)
      if (!adapter) {
         throw new Error(`MdmAdapterError: No MDM adapter registered under alias '${targetAlias}'`)
      }
      return adapter
   }

   /**
    * Register an Archetype Specification schema in the central MDM registry.
    */
   public static registerArchetype(archetype: MdmArchetypeSpec): void {
      this._archetypes.set(archetype.archetypeId, archetype)
      Core.log(`Registered MDM Archetype Spec '${archetype.archetypeId}' (${archetype.nature})`, 'Mdm')
   }

   /**
    * Retrieve a registered Archetype Specification schema by ID.
    */
   public static getArchetype(archetypeId: string): MdmArchetypeSpec | undefined {
      return this._archetypes.get(archetypeId)
   }

   /**
    * Register a custom AbstractMdmObject child model class for a given archetype ID.
    */
   public static registerModel<T extends AbstractMdmObject>(archetypeId: string, modelClass: MdmObjectConstructor<T>): void {
      this._models.set(archetypeId, modelClass)
      Core.log(`Registered custom AbstractMdmObject child model for archetype '${archetypeId}'`, 'Mdm')
   }

   /**
    * Retrieve a registered custom AbstractMdmObject child model class by archetype ID.
    */
   public static getModel<T extends AbstractMdmObject>(archetypeId: string): MdmObjectConstructor<T> | undefined {
      return this._models.get(archetypeId)
   }

   // --- Specification Read/Write Delegation Methods ---

   public static async saveSpecification(object: AbstractMdmObject, spec: Specification, alias?: string): Promise<Specification> {
      return this.getAdapter(alias).saveSpecification(object, spec)
   }

   public static async saveSpecifications(object: AbstractMdmObject, specs: Specification[], alias?: string): Promise<Specification[]> {
      return this.getAdapter(alias).saveSpecifications(object, specs)
   }

   public static async getSpecifications(object: AbstractMdmObject, alias?: string): Promise<Specification[]> {
      return this.getAdapter(alias).getSpecifications(object)
   }

   // --- Vendor & ObjectVendor Read/Write Delegation Methods ---

   public static async saveVendor(vendor: Vendor, alias?: string): Promise<Vendor> {
      return this.getAdapter(alias).saveVendor(vendor)
   }

   public static async getVendor(vendorId: string, alias?: string): Promise<Vendor | null> {
      return this.getAdapter(alias).getVendor(vendorId)
   }

   public static async attachVendor(
      object: AbstractMdmObject,
      vendor: Vendor,
      vendorSku?: string,
      role?: string,
      isPrimary?: boolean,
      alias?: string
   ): Promise<ObjectVendor> {
      return this.getAdapter(alias).attachVendor(object, vendor, vendorSku, role, isPrimary)
   }

   public static async getObjectVendors(object: AbstractMdmObject, alias?: string): Promise<ObjectVendor[]> {
      return this.getAdapter(alias).getObjectVendors(object)
   }

   public static async getVendors(object: AbstractMdmObject, alias?: string): Promise<Vendor[]> {
      return this.getAdapter(alias).getVendors(object)
   }
}
