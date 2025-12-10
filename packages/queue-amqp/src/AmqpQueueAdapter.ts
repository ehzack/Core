import { AbstractQueueAdapter, Queue } from '@quatrain/queue'
import amqplib, { ChannelModel, ConsumeMessage, Message } from 'amqplib'

export class AmqpQueueAdapter extends AbstractQueueAdapter {
   protected _client: ChannelModel | undefined

   protected async _connect() {
      if (this._client) {
         return this._client
      }

      const {
         host = 'localhost',
         user = 'guest',
         password = 'guest',
         port = 5672,
      } = this._params.config || {}

      this._client = await amqplib.connect(
         `amqp://${user}:${password}@${host}:${port}`
      )
   }

   protected async _disconnect() {
      await this._client?.close()
   }

   async send(data: any, topic: string): Promise<string> {
      await this._connect()

      const channel = await this._client?.createChannel()

      const dataBuffer = Buffer.from(JSON.stringify(data))
      Queue.info(`[AMQP] Sending message to ${topic}`)

      channel?.sendToQueue(topic, dataBuffer)
      channel?.close()

      const id = Date.now() // fake
      Queue.info(`[AMQP] Message send with id ${id}`)

      return String(id)
   }

   async listen(
      topic: string | undefined = this._params.topic,
      messageHandler: Function,
      params?: any
   ) {
      if (!topic) {
         throw new Error(`No topic provided for listening.`)
      }

      const concurrency = params?.concurrency || 0

      Queue.info(
         `Starting to listen to topic ${topic} with max concurrency set to ${concurrency}`
      )

      let concurrents = 0
      await this._connect()
      const channel = await this._client?.createChannel()
      await channel?.prefetch(1) // only get one message at a time

      await channel?.assertQueue(topic)

      return channel?.consume(
         topic,
         async (msg: ConsumeMessage | null) => {
            if (msg === null) {
               return
            }

            channel?.ack(msg)

            concurrents++
            Queue.info(
               `Concurrent job #${concurrents} of ${
                  concurrency > 0 ? concurrency : 'unlimited'
               } triggered`
            )

            if (concurrency > 0 && concurrents >= concurrency) {
               Queue.info(
                  `Reached max concurrency of ${concurrency}, disconnecting from queue`
               )
               await this._disconnect()
            }
            try {
               await messageHandler(msg.content.toString(), params)
            } catch (err) {
               Queue.error(
                  `messageHandler function failed with message: ${
                     (err as Error).message
                  }`
               )
            }

            if (concurrency > 0 && concurrents >= concurrency) {
               Queue.info(
                  `Reached max concurrency of ${concurrency}, exiting gracefully`
               )
               // Queue.info(
               //    'Sleeping 5 seconds to allow asynchronous calls to finish'
               // )
               // await Queue.sleep(5)
               process.exit()
            }
         }
         // { noAck: true } // auto-hack
      )
   }
}
