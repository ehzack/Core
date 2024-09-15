import { BackendInterface } from './types/BackendInterface'
import { BaseRepository } from './BaseRepository'
import { Entity, EntityType } from '@quatrain/core'
import { Backend } from './Backend'

export default class EntityRepository extends BaseRepository<EntityType> {
   constructor(backendAdapter: BackendInterface = Backend.getBackend()) {
      super(Entity, backendAdapter)
   }
}
