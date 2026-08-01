import { Core } from '@quatrain/core'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'

/**
 * Type alias for concrete AbstractMdmObject child class constructor
 */
export type MdmObjectConstructor<T extends AbstractMdmObject> = (typeof AbstractMdmObject) & {
   new (dao: any): T
   fromObject: (data: Record<string, unknown>) => T
}

/**
 * Abstract Adapter for MDM Providers
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
}
