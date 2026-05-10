import { AsyncLocalStorage } from 'async_hooks'
import { User } from './User'

/**
 * Interface defining the structure of the thread-local state stored during a request lifecycle.
 * Used primarily for storing the authenticated `User` making the current request.
 */
export interface BackendStore {
   user?: User
   [key: string]: any
}

/**
 * A Node.js `AsyncLocalStorage` instance providing asynchronous thread-local state.
 * Allows deep backend services and middlewares to access request-specific data (like the current user) without prop drilling.
 */
export const BackendContext = new AsyncLocalStorage<BackendStore>()

/**
 * Express-compatible middleware to initialize an empty `BackendContext` for the incoming request lifecycle.
 * This must be executed before any authentication or data access operations occur in the request pipeline.
 * 
 * @param req - The HTTP Request object.
 * @param res - The HTTP Response object.
 * @param next - The callback to pass control to the next middleware.
 */
export const asyncContextMiddleware = (req: any, res: any, next: any) => {
   BackendContext.run({}, () => {
      next()
   })
}
