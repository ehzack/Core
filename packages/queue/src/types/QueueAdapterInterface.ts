export interface QueueAdapterInterface {
   send(data: any, topic: string): Promise<string>

   listen(topic: string, messageHandler: Function, params: any): any
}
