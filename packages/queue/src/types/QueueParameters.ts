export interface ConfigParameters {
   host?: string
   port?: number
   user?: string
   password?: string
   accesskey?: string
   secret?: string
   accountid?: string
}

export interface QueueParameters {
   topic?: string
   region?: string
   config?: ConfigParameters
}
