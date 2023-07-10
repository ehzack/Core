import { DataObjectClass } from '../../components'
import { BackendAction } from '../../Backend'
import { User } from '../../components/User'
import Middleware from './Middleware'

export interface InjectMetaMiddlewareParams {
   user: User
}

export class InjectMetaMiddleware implements Middleware {
   protected _user: User

   constructor(params: InjectMetaMiddlewareParams) {
      this._user = params.user
   }

   execute(dataObject: DataObjectClass<any>, action: BackendAction) {
      switch (action) {
         // add properties existence validation
         case BackendAction.CREATE:
            dataObject.set('createdBy', this._user)
            dataObject.set('createdAt', Date.now())
         case BackendAction.UPDATE:
            dataObject.set('updatedBy', this._user)
            dataObject.set('updatedAt', Date.now())
         case BackendAction.DELETE:
            dataObject.set('deletedBy', this._user)
            dataObject.set('deleteddAt', Date.now())
         default:
            break
      }

      return
   }
}
