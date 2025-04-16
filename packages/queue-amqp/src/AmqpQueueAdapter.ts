import { AbstractQueueAdapter, Queue, QueueParameters } from '@quatrain/queue'
import { AMQPClient, AMQPMessage } from '@cloudamqp/amqp-client'

export class AmqpQueueAdapter extends AbstractQueueAdapter {
   constructor(params: QueueParameters) {
      super(params)
      const {
         host = 'localhost',
         user = 'guest',
         password = 'guest',
         port = 5672,
      } = params.config || {}

      this._client = new AMQPClient(
         `amqp://${user}:${password}@${host}:${port}`
      )
   }

   async send(data: any, topic: string): Promise<string> {
      const connection = await this._client.connect()

      const channel = await connection.channel()
      const queue = await channel.queue(topic)
      const dataBuffer = Buffer.from(JSON.stringify(data))
      Queue.info(`[AMQP] Sending message to ${topic}`)
      const res = await queue.publish(dataBuffer, { deliveryMode: 2 })
      Queue.info(`[AMQP] Message send with id ${res.confirmId}`)

      return res.confirmId
   }

   async listen(
      topic: string | undefined = this._params.topic,
      messageHandler: Function
   ) {
      if (!topic) {
         throw new Error(`No topic provided for listening.`)
      }
      const connection = await this._client.connect()

      const channel = await connection.channel()
      const queue = await channel.queue(topic)

      return queue.subscribe(
         { noAck: true },
         async (message: AMQPMessage) => await messageHandler(message.bodyToString())
      )
   }
}
