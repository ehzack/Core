import { Core } from '../Core'
import { BackendInterface, Query } from '../backends'
import { NotFoundError, UnauthorizedError } from '../common/ResourcesErrors'
import AbstractRepository from './AbstractRepository'
import { User } from './User'

const UNAUTHORIZED_ERROR = `Wrong password or email`

export default class UserRepository extends AbstractRepository<User> {
   constructor(backendAdapter?: BackendInterface) {
      super(User, backendAdapter)
   }

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
