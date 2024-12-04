import { User } from '@quatrain/backend'
import {
   Auth,
   AbstractAuthAdapter,
   AuthenticationError,
   AuthParameters,
} from '@quatrain/auth'
import { CreateRequest, UpdateRequest, getAuth } from 'firebase-admin/auth'
import { getApps, initializeApp } from 'firebase-admin/app'

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
}
