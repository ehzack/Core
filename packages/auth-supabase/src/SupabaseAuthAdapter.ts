import { User } from '@quatrain/backend'
import {
   Auth,
   AbstractAuthAdapter,
   AuthenticationError,
   AuthParameters,
} from '@quatrain/auth'
import { createClient } from '@supabase/supabase-js'
import * as nativeFetch from 'node-fetch-native'

// Create a single supabase client for interacting with your database
export class SupabaseAuthAdapter extends AbstractAuthAdapter {
   protected _client: any

   constructor(params: AuthParameters = {}) {
      super(params)
      this._client = createClient(
         params.config.supabaseUrl,
         params.config.supabaseKey,
         {
            auth: {
               autoRefreshToken: false,
               persistSession: false,
            },
         }
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
            //disabled = false,
         } = user._

         Auth.log(`[SAA] Adding user '${displayName}'`)
         const { data, error } = await this._client.auth.admin.createUser({
            email,
            password,
         })

         if (error) {
            console.log(error)
            throw new Error(error)
         }

         return data.user
      } catch (err) {
         console.log(err)
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

   async refreshToken(refreshToken: string) {
      const url = `${this._params.config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`
      const response = await nativeFetch.fetch(url, {
         method: 'POST',
         headers: {
            apikey: this._params.config.supabaseKey,
         },
         body: JSON.stringify({
            refresh_token: refreshToken,
         }),
      })

      const data = response.json()

      return data
   }

   async revokeAuthToken(token: string) {
      // Careful, this only delete tokens on client side, not on server side
      const { error } = await this._client.auth.signOut()
   }

   async signup(login: string, password: string) {
      const { data, error } = await this._client.auth.signInWithPassword({
         email: login,
         password,
      })

      if (error !== null) {
         Auth.log(error)
         return false
      }

      return { user: data.user, session: data.session }
   }

   async signout(user: User): Promise<any> {}

   async update(user: User, updatable: any): Promise<any> {
      Auth.log('auth data to update', JSON.stringify(updatable))

      try {
         if (Object.keys(updatable).length > 0) {
            Auth.log(`Updating ${updatable.displayName} Auth record`)
            const { data, error } =
               await this._client.auth.admin.updateUserById(user.uid, updatable)
            if (error !== null) {
               Auth.log(error)
            }
         }
      } catch (e) {}
   }

   async delete(user: User): Promise<any> {
      // return await getAuth().deleteUser(user.uid)
   }

   async setCustomUserClaims(id: string, claims: any) {
      Auth.log(`Updating user ${id} with claims ${JSON.stringify(claims)}`)
      const { data, error } = await this._client.auth.admin.updateUserById(id, {
         user_metadata: claims,
      })

      console.log(data, error)
      if (error) {
         throw new Error(error)
      } else {
         return data
      }
   }
}
