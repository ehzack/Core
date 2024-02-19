import { BackendInterface } from '../backends/types/BackendInterface';
import BaseRepository from './BaseRepository';
import { EntityType } from './Entity';
export default class EntityRepository extends BaseRepository<EntityType> {
    constructor(backendAdapter?: BackendInterface);
}
