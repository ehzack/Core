import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import {
   HttpsFunction,
   HttpsOptions,
   onRequest,
} from 'firebase-functions/v2/https'
import {
   onDocumentWritten,
   onDocumentCreated,
   onDocumentUpdated,
   onDocumentDeleted,
} from 'firebase-functions/v2/firestore'
import { CloudFunction, setGlobalOptions } from 'firebase-functions/v2'
import { onObjectFinalized } from 'firebase-functions/v2/storage'
import {
   CloudWrapper,
   AbstractCloudWrapper,
   DatabaseTriggerType,
} from '@quatrain/cloudwrapper'
import { BackendAction } from '@quatrain/backend'

export type FirebaseParams = {
   region?: string[]
   useEmulator?: boolean
   projectId?: string
   serviceAccount?: string
}

export class FirebaseCloudWrapper extends AbstractCloudWrapper {
   protected _isInitialized = false

   constructor(params: FirebaseParams) {
      super(params)
      const { useEmulator, region } = params
      if (useEmulator === false && region) {
         setGlobalOptions({ region: region.join(',') })
      }
   }

   httpsTrigger(
      func: any,
      params: HttpsOptions = { memory: '4GiB', timeoutSeconds: 500 }
   ): HttpsFunction {
      this._initialize()
      return onRequest(
         {
            concurrency: 500,
            ...params,
         },
         func
      )
   }

   // databaseTrigger(trigger: DatabaseTriggerType): CloudFunction<any> {
   //    this._initialize()
   //    switch (trigger.event) {
   //       case BackendAction.CREATE:
   //          return onDocumentCreated(trigger.path, trigger.script)
   //       case BackendAction.UPDATE:
   //          return onDocumentUpdated(trigger.path, trigger.script)
   //       case BackendAction.DELETE:
   //          return onDocumentDeleted(trigger.path, trigger.script)
   //       case BackendAction.WRITE:
   //          return onDocumentWritten(trigger.path, trigger.script)
   //       default:
   //          throw new Error(`Unknown event type '${trigger.event}'`)
   //    }
   // }

   storageTrigger(func: any, eventType: BackendAction) {
      this._initialize()
      switch (eventType) {
         case BackendAction.CREATE:
            return onObjectFinalized(async (object: any) => await func(object))
         default:
            throw new Error(`Unknown event type '${eventType}'`)
      }
   }

   protected _initialize() {
      if (this._isInitialized === false) {
         const { projectId, serviceAccount } = this._params
         CloudWrapper.log(`[FCW] Firebase App init for project ${projectId}`)
         //if (this._params.useEmulator === true) {
         // if emulator is active, we need a service account to access storage functions
         // @see bin/setServiceAccountPath.sh
         const config = {
            ...(serviceAccount && {
               credential: credential.cert(require(serviceAccount)),
            }),
            ...(projectId && { projectId }),
         }
         initializeApp(config)
         this._isInitialized = true
      }
   }
}
