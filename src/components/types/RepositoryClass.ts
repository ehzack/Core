import { BackendInterface } from '../../backends/AbstractAdapter'
import { Query } from '../../backends/Query'
import { BaseObjectCore } from '../BaseObject'
import { BaseObject } from '../BaseObjectProperties'
import Payload from './Payload'

export default interface RepositoryClass<T extends BaseObject> {
   backendAdapter: BackendInterface

   /**
    * Creates a given object in the collection and returns it
    * @param obj
    * @returns
    */
   create(obj: T): Promise<T>

   /**
    * Returns an object of the collection from its uid
    * @param uid
    * @returns
    */
   read(uid: string): Promise<T>

   /**
    * Updates a given object in the collction and returns it
    * @param obj
    * @returns
    */
   update(obj: T): Promise<T>

   /**
    * Deletes a given object of the collection
    * @param uid
    * @returns
    */
   delete(uid: string): Promise<void>

   /**
    * Executes a given query on the collection
    * @param query
    * @returns
    */
   query(query: Query<typeof BaseObjectCore>): Promise<Payload<T>>
}
