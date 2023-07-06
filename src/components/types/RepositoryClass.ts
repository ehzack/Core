import { BackendInterface } from '../../backends/AbstractAdapter'
import { Query } from '../../backends/Query'
import { BaseObjectCore } from '../BaseObject'
import { BaseObject } from '../BaseObjectProperties'
import { Proxy } from './ProxyConstructor'
import Payload from './Payload'
import { Persisted } from './Persisted'

export default interface RepositoryClass<T extends BaseObject> {
   backendAdapter: BackendInterface

   /**
    * Creates a given object in the collection and returns it
    * @param obj
    * @returns
    */
   create(obj: Proxy<T>): Promise<Persisted<T>>

   /**
    * Returns an object of the collection from its uid
    * @param uid
    * @returns
    */
   read(uid: string): Promise<Persisted<T>>

   /**
    * Updates a given object in the collction and returns it
    * @param obj
    * @returns
    */
   update(obj: Proxy<T>): Promise<Persisted<T>>

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
   query(query: Query<typeof BaseObjectCore>): Promise<Payload<Persisted<T>>>
}
