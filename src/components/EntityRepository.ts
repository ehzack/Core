import { Core } from '../Core'
import { BackendInterface } from '../backends/types/BackendInterface'
import BaseRepository from './BaseRepository'
import { Entity, EntityCore } from './Entity'

export default class EntityRepository extends BaseRepository<Entity> {
   constructor(backendAdapter: BackendInterface = Core.getBackend()) {
      super(EntityCore, backendAdapter)
   }
}
