import {
   CloudWrapper,
   AbstractCloudWrapper,
   DatabaseTriggerType,
   StorageTriggerType,
   StorageEventPayloadType,
} from '@quatrain/cloudwrapper'
import { BackendAction } from '@quatrain/backend'
import {
   createClient,
   SupabaseClient,
   RealtimeChannel,
} from '@supabase/supabase-js'
import { FileType } from '@quatrain/storage'

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

      if (Array.isArray(trigger.event)) {
         const params = trigger.event.forEach((event) => {
            return this.databaseTrigger({
               ...trigger,
               event,
               name: `${trigger.name}-${event}`,
            })
         })
         return params
      }

      try {
         const schema = trigger.schema || 'public'
         const params = {
            event: Reflect.get(eventMap, trigger.event),
            schema,
            table: trigger.model,
         }
         CloudWrapper.info(
            `Set up DB trigger ${trigger.name} for ${trigger.event} event on table ${schema}.${params.table}`
         )
         this._supabaseClient
            ?.channel(trigger.name)
            .on(
               'postgres_changes',
               params,
               async ({ old: before, new: after, ...context }) => {
                  CloudWrapper.info(
                     `Triggering function on event ${trigger.name}`
                  )
                  try {
                     return await trigger.script({ before, after, context })
                  } catch (err) {
                     CloudWrapper.error((err as Error).message)
                     console.log(err)
                  }
               }
            )
            .subscribe()
         return params
      } catch (err) {
         console.log(err)
         throw new Error(`Realtime channel subscription failed`)
      }
   }

   storageTrigger(trigger: StorageTriggerType) {
      this._initialize()

      if (!this._realtimeClient) {
         throw new Error(`Realtime channel is not enabled`)
      }

      if (typeof trigger.script !== 'function') {
         throw new Error(`Passed script value is not a function`)
      }

      if (Array.isArray(trigger.event)) {
         const params = trigger.event.forEach((event) => {
            return this.storageTrigger({
               ...trigger,
               event,
               name: `${trigger.name}-${event}`,
            })
         })
         return params
      }

      try {
         const params = {
            event: Reflect.get(eventMap, trigger.event),
            schema: 'storage',
            table: 'objects',
         }
         CloudWrapper.info(
            `Set up Storage trigger ${trigger.name} for ${trigger.event} event`
         )
         this._supabaseClient
            ?.channel(trigger.name)
            .on(
               'postgres_changes',
               params,
               async ({ old: before, new: after, ...context }) => {
                  CloudWrapper.info(
                     `Triggering function on event ${trigger.name}`
                  )
                  try {
                     const payload: StorageEventPayloadType = {
                        before: this._payload2File(before),
                        after: this._payload2File(after),
                        context,
                     }
                     return await trigger.script(payload)
                  } catch (err) {
                     CloudWrapper.error((err as Error).message)
                     console.log(err)
                  }
               }
            )
            .subscribe()
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

   protected _payload2File(payload: {
      [x: string]: any
   }): FileType | undefined {
      if (Object.keys(payload).length === 0) {
         return undefined
      }

      const { size, mimetype } = payload.metadata
      return {
         host: 'supabase',
         bucket: payload.bucket_id,
         ref: payload.name,
         contentType: mimetype,
         size,
      }
   }
}
