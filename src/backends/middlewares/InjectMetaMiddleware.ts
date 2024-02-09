import { DataObjectClass } from '../../components'
import { BackendAction } from '../../Backend'
import { User, UserCore } from '../../components/User'
import Middleware from './Middleware'

export interface InjectMetaMiddlewareParams {
   user: UserCore
}

export class InjectMetaMiddleware implements Middleware {
   protected _user: UserCore

   constructor(params: InjectMetaMiddlewareParams) {
      this._user = params.user
   }

   execute(dataObject: DataObjectClass<any>, action: BackendAction) {
      switch (action) {
         // add properties existence validation
         case BackendAction.CREATE:
            dataObject.set('createdBy', this._user)
            dataObject.set('createdAt', Date.now())
            break
         case BackendAction.UPDATE:
            dataObject.set('updatedBy', this._user)
            dataObject.set('updatedAt', Date.now())
            break
         case BackendAction.DELETE:
            dataObject.set('deletedBy', this._user)
            dataObject.set('deletedAt', Date.now())
            break
         default:
            break
      }

      return
   }
}
