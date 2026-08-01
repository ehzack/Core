import { Core } from '@quatrain/core'
import { MdmObject } from './MdmObject'
import { MdmObjectTypeDefinition } from './MdmObjectType'

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

   abstract registerType(typeDef: MdmObjectTypeDefinition): Promise<void>
   abstract getType(archetypeId: string): Promise<MdmObjectTypeDefinition | null>
   abstract createObject(data: Record<string, any>): Promise<MdmObject>
   abstract getObject(uid: string): Promise<MdmObject | null>
}
