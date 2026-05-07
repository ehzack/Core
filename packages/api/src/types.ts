export interface ApiRequest {
   body: any
   params: Record<string, string>
   query: Record<string, any>
   headers?: Record<string, string | string[] | undefined>
}

export interface ApiResponse {
   status(code: number): this
   json(data: any): void
   send(data: string): void
   setHeader(name: string, value: string): void
   write(data: string): void
   end(): void
}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<void> | void
export type ApiMiddleware = (req: ApiRequest, res: ApiResponse) => Promise<boolean> | boolean

export interface ServerAdapter {
   get(path: string, handler: ApiHandler): void
   post(path: string, handler: ApiHandler): void
   put(path: string, handler: ApiHandler): void
   delete(path: string, handler: ApiHandler): void
   
   use(middleware: ApiMiddleware | any): void
   addMiddleware?(middleware: ApiMiddleware): void
   createRouter(path: string): ServerAdapter
   start(port: number, callback?: () => void): void
   getNativeInstance(): any
   
   /**
    * Configures the server to serve static files from a specified folder.
    * Automatically handles fallback routing for Single Page Applications (SPA).
    * 
    * @param folderPath The absolute path to the directory containing static files.
    * @param apiPrefix The prefix used for API routes (ignored by SPA fallback).
    */
   serveStatic(folderPath: string, apiPrefix?: string): void

   addEndpoint(handler: EndpointHandler, endpointRoot: string, options?: EndpointOptions): void
}

export interface EndpointOptions {
   methods?: string[]
   middlewares?: any[]
}

export type EndpointHandler = (router: ServerAdapter, path: string, options: EndpointOptions) => void
