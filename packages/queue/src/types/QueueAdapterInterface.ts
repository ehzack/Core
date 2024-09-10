export interface QueueAdapterInterface {

  send(data: any, topic: string): Promise<string>

  listen(topic: string): any
}