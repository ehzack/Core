import {
   CloudWrapper,
   AbstractCloudWrapper,
   DatabaseTriggerType,
} from '@quatrain/cloudwrapper'
import { BackendAction } from '@quatrain/backend'
import {
   createClient,
   SupabaseClient,
   RealtimeChannel,
} from '@supabase/supabase-js'

export type SupabaseParams = {
   useEmulator?: boolean
   url?: string
   key?: string
}

export const eventMap = {
   [BackendAction.CREATE]: 'INSERT',
   [BackendAction.UPDATE]: 'UPDATE',
   [BackendAction.DELETE]: 'DELETE',
}

export class SupabaseCloudWrapper extends AbstractCloudWrapper {
   protected _supabaseClient: SupabaseClient | undefined
   protected _realtimeClient: RealtimeChannel | undefined
   protected _isInitialized = false

   constructor(params: SupabaseParams) {
      super(params)
      this._initialize()
   }

   // httpsTrigger(
   //    func: any,
   //    params: HttpsOptions = { memory: '4GiB', timeoutSeconds: 500 }
   // ): HttpsFunction {
   //    this._initialize()
   //    return onRequest(
   //       {
   //          concurrency: 500,
   //          ...params,
   //       },
   //       func
   //    )
   // }

   databaseTrigger(trigger: DatabaseTriggerType) {
      this._initialize()

      if (!this._realtimeClient) {
         throw new Error(`Realtime channel is not enabled`)
      }

      if (typeof trigger.script !== 'function') {
         throw new Error(`Passed script value is not a function`)
      }

      try {
         const params = {
            event: Reflect.get(eventMap, trigger.event),
            schema: 'public',
            table: trigger.model,
         }
         this._supabaseClient
            ?.channel(trigger.name)
            .on(
               'postgres_changes',
               params,
               async ({ old: before, new: after, ...context }) => {
                  console.log(after)
                  CloudWrapper.info(`Triggering function on event`)
                  try {
                     return await trigger.script({ before, after, context })
                  } catch (err) {
                     CloudWrapper.error((err as Error).message)
                     console.log(err)
                  }
               }
            ).subscribe()
         return params
      } catch (err) {
         console.log(err)
         throw new Error(`Realtime channel subscription failed`)
      }
   }

   triggersEnable() {
      if (!this._realtimeClient) {
         throw new Error(`Realtime client is not enabled`)
      }
      this._realtimeClient.subscribe((res) => {
         CloudWrapper.info(`Enabling Realtime triggers: ${res}`)
         if (res !== 'SUBSCRIBED') {
            throw new Error(`Failed to subscribe to Realtime channels`)
         }
      })
   }

   triggersDisable() {
      if (!this._realtimeClient) {
         throw new Error(`Realtime channel is not enabled`)
      }
      CloudWrapper.info(`Disabling Realtime triggers`)
      this._supabaseClient?.removeAllChannels()
   }

   protected _initialize() {
      if (this._isInitialized === false) {
         this._supabaseClient = createClient(this._params.url, this._params.key)
         this._realtimeClient = this._supabaseClient.channel('table-db-changes')
         this._isInitialized = true
         CloudWrapper.info(`Supabase App initialized`)
      }
   }
}
