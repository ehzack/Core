import { AmqpQueueAdapter } from './AmqpQueueAdapter'
import { AMQPClient, AMQPMessage } from '@cloudamqp/amqp-client'
import { Queue } from '@quatrain/queue'

// Mock the @cloudamqp/amqp-client library
jest.mock('@cloudamqp/amqp-client')

// Mock @quatrain/queue to spy on Queue.info
jest.mock('@quatrain/queue', () => ({
   ...jest.requireActual('@quatrain/queue'),
   Queue: {
      info: jest.fn(),
   },
}))

const mockPublish = jest
   .fn()
   .mockResolvedValue({ confirmId: 'mock-confirm-id' })
const mockSubscribe = jest.fn()
const mockQueue = jest.fn().mockResolvedValue({
   publish: mockPublish,
   subscribe: mockSubscribe,
})
const mockChannel = jest.fn().mockResolvedValue({
   queue: mockQueue,
})
const mockConnect = jest.fn().mockResolvedValue({
   channel: mockChannel,
})

const AMQPClientMock = AMQPClient as jest.Mock

AMQPClientMock.mockImplementation(() => {
   return {
      connect: mockConnect,
   }
})

describe('AmqpQueueAdapter', () => {
   const params = {
      config: {
         host: 'test-host',
         user: 'test-user',
         password: 'test-password',
         port: 1234,
      },
      topic: 'default-topic',
   }

   beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      AMQPClientMock.mockClear()
      mockConnect.mockClear()
      mockChannel.mockClear()
      mockQueue.mockClear()
      mockPublish.mockClear()
      mockSubscribe.mockClear()
      ;(Queue.info as jest.Mock).mockClear()
   })

   it('should construct with default and custom parameters', () => {
      new AmqpQueueAdapter({ config: {} })
      expect(AMQPClientMock).toHaveBeenCalledWith(
         'amqp://guest:guest@localhost:5672?frameMax=0'
      )

      new AmqpQueueAdapter(params)
      expect(AMQPClientMock).toHaveBeenCalledWith(
         'amqp://test-user:test-password@test-host:1234?frameMax=0'
      )
   })

   describe('send', () => {
      it('should send a message to the specified topic', async () => {
         const adapter = new AmqpQueueAdapter(params)
         const data = { key: 'value' }
         const topic = 'test-topic'

         const confirmId = await adapter.send(data, topic)

         expect(mockConnect).toHaveBeenCalledTimes(1)
         expect(mockChannel).toHaveBeenCalledTimes(1)
         expect(mockQueue).toHaveBeenCalledWith(topic)
         expect(mockPublish).toHaveBeenCalledWith(
            Buffer.from(JSON.stringify(data)),
            { deliveryMode: 2 }
         )
         expect(Queue.info).toHaveBeenCalledWith(
            `[AMQP] Sending message to ${topic}`
         )
         expect(Queue.info).toHaveBeenCalledWith(
            `[AMQP] Message send with id mock-confirm-id`
         )
         expect(confirmId).toBe('mock-confirm-id')
      })
   })

   describe('listen', () => {
      it('should listen to the default topic if none is provided', async () => {
         const adapter = new AmqpQueueAdapter(params)
         const handler = jest.fn()

         await adapter.listen(undefined, handler)

         expect(mockConnect).toHaveBeenCalledTimes(1)
         expect(mockChannel).toHaveBeenCalledTimes(1)
         expect(mockQueue).toHaveBeenCalledWith(params.topic)
         expect(mockSubscribe).toHaveBeenCalledWith(
            { noAck: true },
            expect.any(Function)
         )
      })

      it('should listen to a specific topic', async () => {
         const adapter = new AmqpQueueAdapter(params)
         const handler = jest.fn()
         const topic = 'specific-topic'

         await adapter.listen(topic, handler)

         expect(mockQueue).toHaveBeenCalledWith(topic)
      })

      it('should throw an error if no topic is available', async () => {
         const adapter = new AmqpQueueAdapter({ config: {} })
         const handler = jest.fn()

         await expect(adapter.listen(undefined, handler)).rejects.toThrow(
            'No topic provided for listening.'
         )
      })

      it('should call the message handler with the message body', async () => {
         const adapter = new AmqpQueueAdapter(params)
         const handler = jest.fn()
         const messageContent = { data: 'test message' }
         const message = {
            bodyToString: () => JSON.stringify(messageContent),
         } as AMQPMessage

         mockSubscribe.mockImplementation(async (options, callback) => {
            await callback(message)
         })

         await adapter.listen('any-topic', handler)

         expect(handler).toHaveBeenCalledWith(JSON.stringify(messageContent))
      })
   })
})
