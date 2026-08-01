import { Core } from '@quatrain/core'
import { AbstractMdmAdapter } from './AbstractMdmAdapter'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { AbstractMdmObject } from './AbstractMdmObject'

export type MdmBackendRegistry<T extends AbstractMdmAdapter> = {
   [alias: string]: T
}

/**
 * Pivot class `Mdm` providing global registry and manager for Master Data Management (MDM).
 * Manages MDM adapters, archetype specification schemas, and concrete AbstractMdmObject child models.
 */
export class Mdm extends Core {
   static defaultAdapter = 'default'
   static logger = this.addLogger('Mdm')

   protected static _adapters: MdmBackendRegistry<any> = {}
   protected static _archetypeSpecs: Map<string, MdmArchetypeSpec> = new Map()
   protected static _models: Map<string, typeof AbstractMdmObject> = new Map()

   /**
    * Registers an MDM adapter into the global registry.
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
    * Registers an archetype specification schema into the global MDM registry.
    */
   static registerArchetype(archetype: MdmArchetypeSpec) {
      this._archetypeSpecs.set(archetype.archetypeId, archetype)
      this.info(`Registered MDM Archetype Spec '${archetype.archetypeId}' (${archetype.nature})`)
   }

   /**
    * Retrieves a registered archetype specification schema by its ID.
    */
   static getArchetype(archetypeId: string): MdmArchetypeSpec | undefined {
      return this._archetypeSpecs.get(archetypeId)
   }

   /**
    * Registers a concrete child class extending AbstractMdmObject for a specific archetype.
    */
   static registerModel(archetypeId: string, modelClass: typeof AbstractMdmObject) {
      this._models.set(archetypeId, modelClass)
      this.info(`Registered custom AbstractMdmObject child model for archetype '${archetypeId}'`)
   }

   /**
    * Retrieves a registered child model class for a given archetype ID.
    */
   static getModel(archetypeId: string): typeof AbstractMdmObject | null {
      return this._models.get(archetypeId) || null
   }
}
