import { User } from '@quatrain/backend'
import {
   Auth,
   AbstractAuthAdapter,
   AuthenticationError,
   AuthParameters,
} from '@quatrain/auth'
import { CreateRequest, UpdateRequest, getAuth } from 'firebase-admin/auth'
import { getApps, initializeApp } from 'firebase-admin/app'
import * as nativeFetch from 'node-fetch-native'

export class FirebaseAuthAdapter extends AbstractAuthAdapter {
   constructor(params: AuthParameters = {}) {
      super(params)
      if (getApps().length === 0) {
         initializeApp(params.config)
      }
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
         const authData: CreateRequest = {
            uid: user.uid,
            email,
            phoneNumber,
            password,
            disabled,
            displayName,
         }
         Auth.log(`[FAA] Adding user '${displayName}'`)
         const userRecord = await getAuth().createUser(authData)

         return userRecord.uid
      } catch (err) {
         throw new AuthenticationError((err as Error).message)
      }
   }

   async getAuthToken(bearer: string) {
      return await getAuth().verifyIdToken(bearer)
   }

   async signup(login: string, password: string) {}

   async signout(user: User): Promise<any> {}

   async update(user: User, updatable: UpdateRequest): Promise<any> {
      Auth.log('auth data to update', JSON.stringify(updatable))

      try {
         if (Object.keys(updatable).length > 0) {
            Auth.log(`Updating ${updatable.displayName} Auth record`)
            await getAuth().updateUser(user.uid, updatable)
         }
      } catch (e) {}
   }

   async delete(user: User): Promise<any> {
      return await getAuth().deleteUser(user.uid)
   }

   async revokeAuthToken(token: string) {}

   async setCustomUserClaims(id: string, claims: any) {}

   async refreshToken(refreshToken: string): Promise<any> {
      if (!this._params.config.apiKey) {
         Auth.warn(`Can't get refresh token, no API key provided`)
         return {}
      }
      const response = await nativeFetch.fetch(
         `https://securetoken.googleapis.com/v1/token?key=${this._params.config.apiKey}`,
         {
            method: 'POST',
            body: JSON.stringify({
               grant_type: 'refresh_token',
               refresh_token: refreshToken,
            }),
            headers: { 'Content-Type': 'application/json' }, //, crossdomain: true },
         }
      )

      const data = response.json()

      return data
   }
}
