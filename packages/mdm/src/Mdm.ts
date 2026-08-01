import { Core } from '@quatrain/core'
import { AbstractMdmAdapter } from './AbstractMdmAdapter'
import { MdmObjectTypeDefinition } from './MdmObjectType'

export type MdmBackendRegistry<T extends AbstractMdmAdapter> = {
   [alias: string]: T
}

/**
 * Pivot class `Mdm` providing global registry and manager for Master Data Management (MDM).
 * Follows the Quatrain Core convention of centralizing dependency access via aliases
 * and managing dynamic object definitions, DataObjects, and PersistedBaseObject models.
 */
export class Mdm extends Core {
   static defaultAdapter = 'default'
   static logger = this.addLogger('Mdm')

   protected static _adapters: MdmBackendRegistry<any> = {}
   protected static _typeDefinitions: Map<string, MdmObjectTypeDefinition> = new Map()
   protected static _models: Map<string, any> = new Map()

   /**
    * Registers an MDM adapter into the global registry.
    * 
    * @param adapter - Instantiated MDM adapter.
    * @param alias - Short identifier name.
    * @param setDefault - If true, sets as default fallback adapter.
    */
   static addAdapter(
      adapter: AbstractMdmAdapter,
      alias: string = 'default',
      setDefault: boolean = false
   ) {
      this._adapters[alias] = adapter
      this.info(`Registered MDM adapter ${adapter.constructor.name} under alias '${alias}'`)
      if (setDefault || Object.keys(this._adapters).length === 1) {
         this.defaultAdapter = alias
      }
   }

   /**
    * Retrieves a registered MDM adapter by alias.
    * 
    * @param alias - Requested adapter identifier.
    * @returns The requested MDM adapter.
    */
   static getAdapter<T extends AbstractMdmAdapter>(
      alias: string = this.defaultAdapter
   ): T {
      if (this._adapters[alias]) {
         return this._adapters[alias]
      }
      throw new Error(`Unknown MDM adapter alias: '${alias}'`)
   }

   /**
    * Registers an archetype definition into the global MDM registry.
    * 
    * @param typeDef - Object type definition.
    */
   static registerObjectType(typeDef: MdmObjectTypeDefinition) {
      this._typeDefinitions.set(typeDef.archetypeId, typeDef)
      this.info(`Registered MDM Archetype Definition '${typeDef.archetypeId}' (${typeDef.nature})`)
   }

   /**
    * Retrieves a registered archetype definition by its ID.
    * 
    * @param archetypeId - Archetype identifier.
    * @returns The archetype definition if found.
    */
   static getObjectType(archetypeId: string): MdmObjectTypeDefinition | undefined {
      return this._typeDefinitions.get(archetypeId)
   }

   /**
    * Registers a custom model class extending PersistedBaseObject for a specific archetype.
    * 
    * @param archetypeId - Archetype identifier.
    * @param modelClass - Model class constructor.
    */
   static registerModel(archetypeId: string, modelClass: any) {
      this._models.set(archetypeId, modelClass)
      this.info(`Registered custom PersistedBaseObject model for archetype '${archetypeId}'`)
   }

   /**
    * Retrieves a registered model class for a given archetype ID.
    * 
    * @param archetypeId - Archetype identifier.
    * @returns The model class constructor if found.
    */
   static getModel(archetypeId: string): any {
      return this._models.get(archetypeId) || null
   }
}
