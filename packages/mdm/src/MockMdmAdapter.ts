import { AbstractMdmAdapter } from './AbstractMdmAdapter'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'

/**
 * Mock MDM Adapter for unit testing and offline development
 */
export class MockMdmAdapter extends AbstractMdmAdapter {
   private _archetypes: Map<string, MdmArchetypeSpec> = new Map()
   private _objects: Map<string, AbstractMdmObject> = new Map()

   async registerArchetype(archetype: MdmArchetypeSpec): Promise<void> {
      this._archetypes.set(archetype.archetypeId, archetype)
   }

   async getArchetype(archetypeId: string): Promise<MdmArchetypeSpec | null> {
      return this._archetypes.get(archetypeId) || null
   }

   async createObject<T extends AbstractMdmObject>(
      modelClass: new (...args: any[]) => T,
      data: Record<string, any>
   ): Promise<T> {
      const obj = (modelClass as any).fromObject(data as any)
      if (obj && obj.dataObject && obj.dataObject.uid) {
         this._objects.set(obj.dataObject.uid, obj)
      }
      return obj
   }

   async getObject<T extends AbstractMdmObject>(
      modelClass: new (...args: any[]) => T,
      uid: string
   ): Promise<T | null> {
      return (this._objects.get(uid) as T) || null
   }
}
