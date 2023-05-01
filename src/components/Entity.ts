import { BaseObject } from './BaseObject'
import { EntityProperties } from './EntityProperties'
import { EntityClass } from './types/EntityClass'

export class Entity extends BaseObject implements EntityClass {
   static PROPS_DEFINITION = EntityProperties

   static async factory(src: any = undefined): Promise<Entity> {
      return super.factory(src, Entity)
   }
}
