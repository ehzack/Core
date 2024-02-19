import { Core } from '../Core'
import { BackendInterface } from '../backends/types/BackendInterface'
import BaseRepository from './BaseRepository'
import { Entity, EntityType } from './Entity'

export default class EntityRepository extends BaseRepository<EntityType> {
   constructor(backendAdapter: BackendInterface = Core.getBackend()) {
      super(Entity, backendAdapter)
   }
}
