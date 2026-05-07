import express from 'express'
import { ServerAdapter, ApiHandler, ApiRequest, ApiResponse, EndpointHandler, EndpointOptions, ApiMiddleware } from '@quatrain/api'

export class ExpressAdapter implements ServerAdapter {
   constructor(
      private appOrRouter: express.Application | express.Router = express(),
      private config: { apiPrefix?: string } = {}
   ) {
      if ('listen' in this.appOrRouter && typeof this.appOrRouter.listen === 'function') {
         // Default global middlewares for top-level application
         (this.appOrRouter as express.Application).disable('x-powered-by')
         this.appOrRouter.use(express.json())
         this.appOrRouter.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
            res.header('Access-Control-Allow-Headers', '*')
            if (req.method === 'OPTIONS') {
               return res.sendStatus(200)
            }
            next()
         })
      }
   }

   private wrapHandler(handler: ApiHandler): express.RequestHandler {
      return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
         try {
            const apiReq: ApiRequest = {
               body: req.body,
               params: req.params,
               query: req.query,
               headers: req.headers
            }

            const apiRes: ApiResponse = {
               status: (code: number) => {
                  res.status(code)
                  return apiRes
               },
               json: (data: any) => {
                  res.json(data)
               },
               send: (data: string) => {
                  res.send(data)
               },
               setHeader: (name: string, value: string) => {
                  res.setHeader(name, value)
               },
               write: (data: string) => {
                  res.write(data)
               },
               end: () => {
                  res.end()
               }
            }

            await handler(apiReq, apiRes)
         } catch (err) {
            next(err)
         }
      }
   }

   get(path: string, handler: ApiHandler): void {
      (this.appOrRouter as express.Router).get(path, this.wrapHandler(handler))
   }

   post(path: string, handler: ApiHandler): void {
      (this.appOrRouter as express.Router).post(path, this.wrapHandler(handler))
   }

   put(path: string, handler: ApiHandler): void {
      (this.appOrRouter as express.Router).put(path, this.wrapHandler(handler))
   }

   delete(path: string, handler: ApiHandler): void {
      (this.appOrRouter as express.Router).delete(path, this.wrapHandler(handler))
   }

   use(middleware: any): void {
      (this.appOrRouter as express.Router).use(middleware)
   }

   addMiddleware(middleware: ApiMiddleware): void {
      const expressMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
         const apiReq: ApiRequest = {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers as Record<string, string | string[] | undefined>
         }

         const apiRes: ApiResponse = {
            status: (code: number) => {
               res.status(code)
               return apiRes
            },
            json: (data: any) => {
               res.json(data)
            },
            send: (data: string) => {
               res.send(data)
            },
            setHeader: (name: string, value: string) => {
               res.setHeader(name, value)
            },
            write: (data: string) => {
               res.write(data)
            },
            end: () => {
               res.end()
            }
         }

         try {
            const shouldContinue = await middleware(apiReq, apiRes)
            if (shouldContinue) {
               next()
            }
         } catch (err) {
            next(err)
         }
      }
      (this.appOrRouter as express.Router).use(expressMiddleware)
   }

   createRouter(path: string): ServerAdapter {
      const router = express.Router()
      ;(this.appOrRouter as express.Router).use(path, router)
      return new ExpressAdapter(router)
   }

   start(port: number, callback?: () => void): void {
      if ('listen' in this.appOrRouter && typeof this.appOrRouter.listen === 'function') {
         this.appOrRouter.listen(port, callback)
      } else {
         throw new Error("Cannot start a server on a Router instance.")
      }
   }

   getNativeInstance(): any {
      return this.appOrRouter
   }

   /**
    * Configures the server to serve static files from a specified folder.
    * It also sets up a fallback route for SPA (Single Page Application) navigation,
    * ensuring that non-API routes return the main index.html file.
    * 
    * @param folderPath The absolute path to the directory containing static files (e.g. built frontend).
    * @param apiPrefix The prefix used for API routes, which will be ignored by the SPA fallback. Defaults to '/api'.
    */
   serveStatic(folderPath: string, apiPrefix: string = '/api'): void {
      const path = require('node:path')
      this.use(express.static(folderPath))
      
      ;(this.appOrRouter as express.Router).get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
         if (req.path.startsWith(apiPrefix)) return next()
         res.sendFile(path.join(folderPath, 'index.html'))
      })
   }

   addEndpoint(handler: EndpointHandler, endpointRoot: string, options: EndpointOptions = {}): void {
      const fullPath = this.config.apiPrefix ? `${this.config.apiPrefix}${endpointRoot}` : endpointRoot
      const router = this.createRouter(fullPath)
      
      if (options.middlewares && options.middlewares.length > 0) {
         options.middlewares.forEach((mw) => router.use(mw))
      }
      
      handler(router, '/', options)
   }
}
