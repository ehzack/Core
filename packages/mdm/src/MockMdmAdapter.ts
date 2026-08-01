import { AbstractMdmAdapter, MdmObjectConstructor } from './AbstractMdmAdapter'
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
      modelClass: MdmObjectConstructor<T>,
      data: Record<string, unknown>
   ): Promise<T> {
      const obj = modelClass.fromObject(data)
      if (obj && obj.dataObject && obj.dataObject.uid) {
         this._objects.set(obj.dataObject.uid, obj)
      }
      return obj
   }

   async getObject<T extends AbstractMdmObject>(
      modelClass: MdmObjectConstructor<T>,
      uid: string
   ): Promise<T | null> {
      return (this._objects.get(uid) as T) || null
   }
}
