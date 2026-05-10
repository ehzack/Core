import {
   BaseObjectType,
   GoneError,
   NotFoundError,
   ObjectUri,
   statuses,
} from '@quatrain/core'
import { DataObjectClass } from './types/DataObjectClass'
import { PersistedDataObject } from './PersistedDataObject'
import { PersistedBaseObject } from './PersistedBaseObject'
import { Query, QueryResultType } from './Query'
import { BackendInterface } from './types/BackendInterface'
import { Backend, BackendAction } from './Backend'
import { ReferenceType } from './types/ReferenceType'
import { User } from './User'

/**
 * A service layer acting as a factory and container for retrieving specific model repositories.
 * Repositories encapsulate complex data access logic beyond basic CRUD operations.
 */
export class Repository {
   /** Registry matching model class names to their corresponding repository file paths. */
   static matches: { [x: string]: string } = {
      User: '@ttm/users/common/UserRepository.ts',
   }
   /** The authenticated user currently operating within this repository context. */
   currentUser: User | undefined
   /** Configuration flag indicating whether dates should be formatted. */
   useDateFormat: boolean = true

   /** The persistence adapter backing this repository. */
   backendAdapter: BackendInterface

   constructor(
      backendAdapter: BackendInterface = Backend.getBackend(),
      currentUser: User | undefined = undefined
   ) {
      this.backendAdapter = backendAdapter
      this.currentUser = currentUser
   }

   /**
    * Assigns an authenticated user to this repository context for permission/audit tracking.
    * 
    * @param user - The `User` instance performing the operations.
    */
   setCurrentUser(user: User) {
      this.currentUser = user
   }

   /**
    * Dynamically resolves and instantiates the specific repository class registered for a given model.
    * 
    * @param model - The model class (extending `PersistedBaseObject`) to find a repository for.
    * @returns An instantiated custom repository, or undefined if resolution fails.
    */
   getFor(model: typeof PersistedBaseObject) {
      const repositoryName = Repository.matches[model.name]

      Backend.info(`Trying to require ${repositoryName}`)
      try {
         const repository = require(repositoryName)
         console.log('repository class', repository)
         if (!repository) {
            throw new Error(`Can't find any repository named: '${repositoryName}'`)
         }
         return new repository.default(model, this.backendAdapter)
      } catch (err) {
         Backend.error(`Can't find any repository named: '${repositoryName}'`)
      }
   }
}
