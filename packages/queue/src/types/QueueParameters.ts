export interface ConfigParameters {
   host?: string
   port?: number
   user?: string
   password?: string
   credentials?: {
      accesskey?: string
      secret?: string
   }
   region?: string
   accountid?: string
}
export interface QueueParameters {
   topic?: string
   config?: ConfigParameters
}
