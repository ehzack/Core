import { Query } from '../backends'
import { BackendInterface } from '../backends/types/BackendInterface'
import { NotFoundError } from '../common/ResourcesErrors'
import BaseRepository from './BaseRepository'
import { User, UserCore } from './User'

const UNAUTHORIZED_ERROR = `Wrong password or email`

export default class UserRepository extends BaseRepository<User> {
   constructor(backendAdapter?: BackendInterface) {
      super(UserCore, backendAdapter)
   }

   async getFromEmail(email: string) {
      const query = new Query<typeof UserCore>(UserCore)

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
