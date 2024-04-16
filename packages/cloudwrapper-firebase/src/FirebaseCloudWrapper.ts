import { initializeApp } from 'firebase-admin/app'
import { HttpsOptions, onRequest } from 'firebase-functions/v2/https'
import {
   onDocumentWritten,
   onDocumentCreated,
   onDocumentUpdated,
   onDocumentDeleted,
} from 'firebase-functions/v2/firestore'
import { setGlobalOptions } from 'firebase-functions/v2'
import { AbstractCloudWrapper, BackendAction } from '@quatrain/core'

export type FirebaseParams = {
   region?: string
   useEmulator?: boolean
}

export class FirebaseCloudWrapper extends AbstractCloudWrapper {
   protected _isInitialized = false

   constructor(params: FirebaseParams) {
      super(params)
      const { useEmulator, region } = params
      if (useEmulator === false && region) {
         setGlobalOptions({ region })
      }
   }

   httpsWrapper(
      func: any,
      params: HttpsOptions = { memory: '4GiB', timeoutSeconds: 500 }
   ) {
      this._initialize()
      return onRequest(
         {
            concurrency: 500,
            ...params,
         },
         func
      )
   }

   databaseWrapper(
      func: any,
      eventType: BackendAction,
      rule: string = 'videos/{vid}/vectos/{uid}'
   ) {
      this._initialize()
      switch (eventType) {
         case BackendAction.CREATE:
            return onDocumentCreated(rule, func)
         case BackendAction.UPDATE:
            return onDocumentUpdated(rule, func)
         case BackendAction.DELETE:
            return onDocumentDeleted(rule, func)
         case BackendAction.WRITE:
            return onDocumentWritten(rule, func)
         default:
            throw new Error(`Unknown event type '${eventType}'`)
      }
   }

   protected _initialize() {
      if (this._isInitialized === false) {
         if (this._params.useEmulator === true) {
            // if emulator is active, we need a service account to access storage functions
            // @see bin/setServiceAccountPath.sh
            initializeApp({
               databaseURL: 'https://totalymage-staging.firebaseio.com',
               storageBucket: 'totalymage-staging.appspot.com',
            })
         } else {
            initializeApp()
         }

         this._isInitialized = true
      }
   }
}
