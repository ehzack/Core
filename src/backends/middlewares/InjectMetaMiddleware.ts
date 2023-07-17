import { DataObjectClass } from '../../components'
import { BackendAction } from '../../Backend'
import { User } from '../../components/User'
import Middleware from './Middleware'
import { Proxy } from '../../components/types/ProxyConstructor'

export interface InjectMetaMiddlewareParams {
   user: Proxy<User>
}

export class InjectMetaMiddleware implements Middleware {
   protected _user: Proxy<User>

   constructor(params: InjectMetaMiddlewareParams) {
      this._user = params.user
   }

   execute(dataObject: DataObjectClass<any>, action: BackendAction) {
      switch (action) {
         // add properties existence validation
         case BackendAction.CREATE:
            dataObject.set('createdBy', this._user.core.dataObject.uri)
            dataObject.set('createdAt', Date.now())
            break
         case BackendAction.UPDATE:
            dataObject.set('updatedBy', this._user.core.dataObject.uri)
            dataObject.set('updatedAt', Date.now())
            break
         case BackendAction.DELETE:
            dataObject.set('deletedBy', this._user.core.dataObject.uri)
            dataObject.set('deletedAt', Date.now())
            break
         default:
            break
      }

      return
   }
}
