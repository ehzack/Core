export interface ConfigParameters {
   // rabbitmq
   host?: string
   port?: number
   user?: string
   password?: string
   // aws sqs
   accesskey?: string
   secret?: string
   region?: string
   accountid?: string
}
export interface QueueParameters {
   topic?: string
   config?: ConfigParameters
}
