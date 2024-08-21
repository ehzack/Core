import {
   AbstractAuthAdapter,
   Core,
   User,
   AuthenticationError,
   AuthParameters,
} from '@quatrain/core'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export class SupabaseAuthAdapter extends AbstractAuthAdapter {
   protected _client: any

   constructor(params: AuthParameters = {}) {
      super(params)
      this._client = createClient(
         params.config.supabaseUrl,
         params.config.supabaseKey
      )
   }

   /**
    * Register new user in authentication
    * @param user
    * @returns user unique id
    */
   async register(user: User) {
      try {
         const {
            name: displayName,
            email,
            phone: phoneNumber,
            password,
            disabled = false,
         } = user._
         const authData = {
            uid: user.uid,
            email,
            phoneNumber,
            password,
            disabled,
            displayName,
         }
         Core.log(`[SAA] Adding user '${displayName}'`)
         // const userRecord = await getAuth().createUser(authData)

         return // userRecord.uid
      } catch (err) {
         throw new AuthenticationError((err as Error).message)
      }
   }

   async getAuthToken(bearer: string) {
      const token = await this._client.auth.getUser(bearer)
      if (token.data && token.data.user) {
         return token.data.user
      }
      throw new Error('Unable to retrieve auth token from Supabase')
   }

   async signup(login: string, password: string) {}

   async signout(user: User): Promise<any> {}

   async update(user: User, updatable: any): Promise<any> {
      console.log('auth data to update', JSON.stringify(updatable))

      try {
         if (Object.keys(updatable).length > 0) {
            console.log(`Updating ${updatable.displayName} Auth record`)
            // await getAuth().updateUser(user.uid, updatable)
         }
      } catch (e) {}
   }

   async delete(user: User): Promise<any> {
      // return await getAuth().deleteUser(user.uid)
   }
}
