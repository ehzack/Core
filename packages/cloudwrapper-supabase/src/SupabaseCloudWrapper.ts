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

export type Channel = {
   name: string
   channel: RealtimeChannel | undefined
   state: any
}

export type Channels = {
   database: Channel[]
   storage: Channel[]
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
   protected _channels: Channels = { database: [], storage: [] }

   constructor(params: SupabaseParams) {
      super(params)
      this._initialize()
   }

   databaseTrigger(trigger: DatabaseTriggerType) {
      this._initialize()

      if (!(this._supabaseClient instanceof SupabaseClient)) {
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
         const channel = this._supabaseClient
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
         this._channels.database.push({
            name: trigger.name,
            channel,
            state: channel.state,
         })

         return params
      } catch (err) {
         CloudWrapper.error(err)
         throw new Error(`Realtime channel subscription failed`)
      }
   }

   storageTrigger(trigger: StorageTriggerType) {
      this._initialize()

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
         const channel = this._supabaseClient
            ?.channel(trigger.name)
            .on(
               'postgres_changes',
               params,
               async ({ old: before, new: after, ...context }) => {
                  CloudWrapper.info(
                     `Triggering storage function on event ${trigger.name}`
                  )
                  try {
                     const payload: StorageEventPayloadType = {
                        before: this._payload2File(before),
                        after: this._payload2File(after),
                        context,
                     }
                     CloudWrapper.debug(payload)
                     return await trigger.script(payload)
                  } catch (err) {
                     CloudWrapper.error((err as Error).message)
                  }
               }
            )
            .subscribe()
         this._channels.storage.push({
            name: trigger.name,
            channel,
            state: channel?.state,
         })
         return params
      } catch (err) {
         console.log(err)
         throw new Error(`Realtime channel subscription failed`)
      }
   }

   protected _initialize() {
      if (this._isInitialized === false) {
         this._supabaseClient = createClient(this._params.url, this._params.key)
         this._isInitialized = true
         CloudWrapper.info(`Supabase App initialized`)
      }
   }

   public poll() {
      CloudWrapper.info(
         `Supabase client status: ${this._supabaseClient?.channel}`
      )
      this._channels.storage.forEach((channel) => {
         CloudWrapper.info(`${channel.name}: ${channel.state}`)
         console.log(channel.channel?.params)
      })
      setTimeout(() => this.poll(), 10000)
   }

   protected _payload2File(payload: {
      [x: string]: any
   }): FileType | undefined {
      if (!payload.metadata) {
         return undefined
      }

      if (Object.keys(payload).length === 0) {
         return undefined
      }

      const { size, mimetype } = payload?.metadata || {}
      return {
         host: 'supabase',
         bucket: payload.bucket_id,
         ref: payload.name,
         contentType: mimetype,
         size,
      }
   }
}
