import { AbstractMdmAdapter } from './AbstractMdmAdapter'
import { MdmObject } from './MdmObject'
import { MdmObjectTypeDefinition } from './MdmObjectType'

/**
 * Mock MDM Adapter for unit testing and offline development
 */
export class MockMdmAdapter extends AbstractMdmAdapter {
   private _types: Map<string, MdmObjectTypeDefinition> = new Map()
   private _objects: Map<string, MdmObject> = new Map()

   async registerType(typeDef: MdmObjectTypeDefinition): Promise<void> {
      this._types.set(typeDef.archetypeId, typeDef)
   }

   async getType(archetypeId: string): Promise<MdmObjectTypeDefinition | null> {
      return this._types.get(archetypeId) || null
   }

   async createObject(data: Record<string, any>): Promise<MdmObject> {
      const obj = MdmObject.fromObject(data as any)
      if (obj && obj.dataObject && obj.dataObject.uid) {
         this._objects.set(obj.dataObject.uid, obj)
      }
      return obj
   }

   async getObject(uid: string): Promise<MdmObject | null> {
      return this._objects.get(uid) || null
   }
}
