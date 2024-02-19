import { BackendInterface } from '../backends/types/BackendInterface';
import BaseRepository from './BaseRepository';
import { UserType } from './User';
export default class UserRepository extends BaseRepository<UserType> {
    constructor(backendAdapter?: BackendInterface);
    getFromEmail(email: string): Promise<UserType>;
}
