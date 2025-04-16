export interface ConfigParameters {
   host?: string
   port?: number
   user?: string
   password?: string
}

export interface QueueParameters {
   topic?: string
   config?: ConfigParameters
}
