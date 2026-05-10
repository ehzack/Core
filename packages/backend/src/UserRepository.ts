import { Query } from './Query'
import { BackendInterface } from './types/BackendInterface'
import { BaseRepository } from './BaseRepository'
import { NotFoundError } from '@quatrain/core'
import { User, UserType } from './User'

/**
 * Specific repository implementation handling `User` model persistence and querying logic.
 */
export class UserRepository extends BaseRepository<UserType> {
   constructor(backendAdapter?: BackendInterface) {
      super(User, backendAdapter)
   }

   /**
    * Finds and loads a user profile based on an exact email match.
    * 
    * @param email - The email address to search for.
    * @returns A promise resolving to the found User object.
    * @throws {NotFoundError} If no user is associated with this email.
    */
   async getFromEmail(email: string) {
      const query = new Query<typeof User>(User)

      query.where('email', email).batch(1)

      const { items } = await this.query(query)

      if (items.length == 0) {
         throw new NotFoundError(`There is no user with email '${email}'`)
      }

      return items[0]
   }

   // There must be a problem with HashProperty
   // Not really important for now
   //This method is just here as an example
   //    async login(email: string, password: string) {
   //       const query = new Query<typeof User>(User)

   //       query.where('email', email).where('password', password).batch(1)

   //       const { items } = await this.query(query)

   //       if (items.length < 1) {
   //          throw new UnauthorizedError(UNAUTHORIZED_ERROR)
   //       }

   //       return items[0]
   //    }
}
