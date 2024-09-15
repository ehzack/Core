import { User } from '@quatrain/core'
import { QueryResultType, Filter, Filters, SortAndLimit } from '@quatrain/backend'

export interface AuthInterface {
   register(user: User): Promise<any>

   signup(login: string, password: string): Promise<any>

   signout(user: User): Promise<any>

   update(user: User, updatable: any): Promise<any>

   delete(user: User): Promise<any>

   getAuthToken(token: string): any

   // find(
   //    filters: Filters | Filter[] | undefined,
   //    pagination: SortAndLimit | undefined
   // ): Promise<QueryResultType<User>>
}
