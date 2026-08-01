import { Core } from '@quatrain/core'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'

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
   abstract createObject<T extends AbstractMdmObject>(modelClass: new (...args: any[]) => T, data: Record<string, any>): Promise<T>
   abstract getObject<T extends AbstractMdmObject>(modelClass: new (...args: any[]) => T, uid: string): Promise<T | null>
}
