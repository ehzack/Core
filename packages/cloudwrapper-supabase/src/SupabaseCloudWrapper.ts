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
import { HeartbeatStatus } from '@supabase/realtime-js/dist/module/RealtimeClient'
import { FileType } from '@quatrain/storage'

export type SupabaseParams = {
   useEmulator?: boolean
   url?: string
   key?: string
   exitOnDisconnect?: boolean
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
   protected _heartbeatOkReceived = false
   protected _connectionTimeout: NodeJS.Timeout | undefined
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
         throw new TypeError(`Passed script value is not a function`)
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
         CloudWrapper.info(`Starting Supabase client with heartbeat monitoring`)

         if (this._connectionTimeout) {
            clearTimeout(this._connectionTimeout)
         }

         this._supabaseClient = createClient(
            this._params.url,
            this._params.key,
            {
               realtime: {
                  heartbeatIntervalMs: 5000,
                  heartbeatCallback: (status: HeartbeatStatus) => {
                     switch (status) {
                        case 'ok':
                           if (!this._heartbeatOkReceived) {
                              CloudWrapper.info(
                                 `🛜 Supabase Realtime connection established`
                              )
                              if (this._connectionTimeout) {
                                 clearTimeout(this._connectionTimeout)
                              }
                              this._heartbeatOkReceived = true
                           }
                           break
                        case 'timeout':
                           CloudWrapper.warn(
                              `⚠️ Supabase Realtime connection timed out`
                           )
                           break
                        case 'disconnected':
                           // Reconnect only if exitOnDisconnect is explicitly set to false.
                           if (this._params.exitOnDisconnect === false) {
                              CloudWrapper.warn(
                                 `❌ Supabase connection lost. Attempting to reconnect...`
                              )
                              this._isInitialized = false
                              this._heartbeatOkReceived = false
                              this._initialize()
                           } else {
                              // Default behavior: exit to allow for a clean restart by the orchestrator.
                              CloudWrapper.error(
                                 `❌ Supabase connection lost. Exiting to allow for a clean restart.`
                              )
                              process.exit(1)
                           }
                           break
                        default:
                           // do nothing
                           break
                     }
                  },
               },
            }
         )
         this._isInitialized = true
         CloudWrapper.info(`Supabase App initialized`)
         CloudWrapper.info(
            `🕘 Supabase Realtime connection is being established`
         )

         this._connectionTimeout = setTimeout(() => {
            if (!this._heartbeatOkReceived) {
               CloudWrapper.error(
                  `❌ Supabase Realtime connection failed to establish after 30 seconds. Exiting.`
               )
               process.exit(1)
            }
         }, 30000)
      }
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
