import { Core } from '@quatrain/core'
import { AbstractQueueAdapter, QueueParameters } from '@quatrain/queue'
import { AMQPClient } from '@cloudamqp/amqp-client'

export class AmqpQueueAdapter extends AbstractQueueAdapter {
   constructor(params: QueueParameters) {
      super(params)
      const { url = 'localhost', user, password, port = 5672 } = params.config

      this._client = new AMQPClient(`amqp://${url}:${port}`)
   }

   async send(data: any, topic: string): Promise<string> {
      const conn = await this._client.connect()

      const ch = await conn.channel()
      const q = await ch.queue()
      const dataBuffer = Buffer.from(JSON.stringify(data))
      const messageId = await q.publish(dataBuffer, { deliveryMode: 2 })

      Core.log(`[AMQP] Sending message to ${topic}`)

      return messageId
   }

   async listen(topic: string) {
      const conn = await this._client.connect()

      const ch = await conn.channel()
      const q = await ch.queue()

      return q.subscribe({ noAck: true })
   }
}
