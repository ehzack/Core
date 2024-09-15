import { Core, DataObjectClass, User } from '@quatrain/core'
import { BackendAction } from '../Backend'
import BackendMiddleware from './Middleware'
import { MiddlewareParams } from './types/MiddlewareParams'

export interface InjectMetaMiddlewareParams {
   user: User
}

export class InjectMetaMiddleware implements BackendMiddleware {
   protected _user: User

   constructor(params: InjectMetaMiddlewareParams) {
      this._user = params.user
   }

   execute(dataObject: DataObjectClass<any>, action: BackendAction, params?: MiddlewareParams) {
      Core.log(`[MDW] Executing Middleware ${this.constructor.name}`)
      const date =  params && params.useDateFormat ? (new Date()).toISOString() : Date.now()
      switch (action) {
         // add properties existence validation
         case BackendAction.CREATE:
            dataObject.set('createdBy', this._user)
            dataObject.set('createdAt', date)
            break
         case BackendAction.UPDATE:
            dataObject.set('updatedBy', this._user)
            dataObject.set('updatedAt', date)
            break
         case BackendAction.DELETE:
            dataObject.set('deletedBy', this._user)
            dataObject.set('deletedAt', date)
            break
         default:
            break
      }

      return
   }
}
