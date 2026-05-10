import { Core } from '@quatrain/core'
import { AbstractQueueAdapter, QueueParameters } from '@quatrain/queue'
import { PubSub } from '@google-cloud/pubsub'

/**
 * Google Cloud Platform Pub/Sub compatible queue adapter interface.
 */
export class PubSubQueueAdapter extends AbstractQueueAdapter {
   constructor(params: QueueParameters) {
      super(params)
      const { projectId, keyFilename } = (params.config as any) || {}

      this._client = new PubSub({
         projectId,
         keyFilename,
      })
   }

   /**
    * Publishes data buffer as a Pub/Sub topic push.
    * 
    * @param data - The data payload.
    * @param topic - The GCP Topic identifier.
    * @returns GCP topic tracking message ID.
    */
   async send(data: any, topic: string): Promise<string> {
      const dataBuffer = Buffer.from(JSON.stringify(data))
      const messageId = await this._client.topic(topic).publish(dataBuffer)

      Core.log(`[Pubsub] Sending message to ${topic}`)

      return messageId
   }

   /**
    * Hooks onto the onPublish listener system for internal pub/sub logic tracking.
    * 
    * @param topic - Destination topic.
    * @returns The GCP listener handler loop.
    */
   listen(topic: string) {
      return this._client.topic(topic).onPublish()
   }
}
