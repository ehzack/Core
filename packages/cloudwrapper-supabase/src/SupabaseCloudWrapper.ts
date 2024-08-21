import {
   AbstractCloudWrapper,
   DatabaseTriggerType,
   BackendAction,
   Core,
} from '@quatrain/core'
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
      this._realtimeClient?.on(
         'postgres_changes',
         {
            event: Reflect.get(eventMap, trigger.event),
            schema: 'public',
            table: trigger.model,
         },
         async ({ old: before, new: after, ...context }) =>
            await trigger.script({ before, after, context })
      )
   }

   triggersEnable() {
      this._realtimeClient?.subscribe()
   }

   protected _initialize() {
      if (this._isInitialized === false) {
         Core.log(`[SPB] Supabase App init`)
         this._supabaseClient = createClient(this._params.url, this._params.key)
         this._realtimeClient = this._supabaseClient.channel('table-db-changes')
         this._isInitialized = true
      }
   }
}
