import { AbstractQueueAdapter } from './AbstractQueueAdapter'
import { QueueParameters } from './types/QueueParameters'
import { randomUUID } from 'node:crypto'

/**
 * Mock Queue Adapter for testing purposes
 */
export class MockQueueAdapter extends AbstractQueueAdapter {
   private messages: Map<string, any[]> = new Map()
   private handlers: Map<string, Function> = new Map()

   constructor(params: QueueParameters) {
      super(params)
   }

   /**
    * Mock implementation tracking the dispatched messages in memory.
    * 
    * @param data - Payload.
    * @param topic - Queue topic.
    * @returns A fake message ID.
    */
   async send(data: any, topic: string): Promise<string> {
      // Store message in the topic's message array
      if (!this.messages.has(topic)) {
         this.messages.set(topic, [])
      }

      const messages = this.messages.get(topic)!
      messages.push(data)

      // Generate a mock message ID
      const messageId = `msg-${Date.now()}-${randomUUID()}`

      // If there's a handler registered for this topic, invoke it
      const handler = this.handlers.get(topic)
      if (handler) {
         // Simulate async message processing
         setTimeout(() => handler(data), 0)
      }

      return messageId
   }

   /**
    * Mocks a listener binding to intercept immediate future send() calls.
    * 
    * @param topic - Queue topic.
    * @param handler - Callback logic.
    * @param params - Context options.
    * @returns The listener context.
    */
   listen(
      topic: string,
      handler: Function,
      params?: { concurrency?: number; gpu?: boolean }
   ): any {
      // Register the handler for this topic
      this.handlers.set(topic, handler)

      // Return a mock listener object
      return {
         topic,
         handler,
         concurrency: params?.concurrency || 1,
         gpu: params?.gpu || false,
      }
   }

   // Helper methods for testing
   /**
    * Retrieves all fake messages routed to a topic.
    * 
    * @param topic - Target topic.
    * @returns The intercepted messages.
    */
   getMessages(topic: string): any[] {
      return this.messages.get(topic) || []
   }

   /**
    * Clears intercepted messages for a topic.
    * 
    * @param topic - Target topic or all if undefined.
    */
   clearMessages(topic?: string): void {
      if (topic) {
         this.messages.delete(topic)
      } else {
         this.messages.clear()
      }
   }

   /**
    * Unbinds registered listeners.
    * 
    * @param topic - Target topic or all if undefined.
    */
   clearHandlers(topic?: string): void {
      if (topic) {
         this.handlers.delete(topic)
      } else {
         this.handlers.clear()
      }
   }

   /**
    * Full reset of the mock adapter.
    */
   clearAll(): void {
      this.clearMessages()
      this.clearHandlers()
   }

   /**
    * Confirms if a listener is bound.
    * 
    * @param topic - Topic name.
    * @returns True if bound.
    */
   hasHandler(topic: string): boolean {
      return this.handlers.has(topic)
   }

   /**
    * Computes total payloads saved.
    * 
    * @param topic - Topic name.
    * @returns Count amount.
    */
   getMessageCount(topic: string): number {
      return this.getMessages(topic).length
   }
}
