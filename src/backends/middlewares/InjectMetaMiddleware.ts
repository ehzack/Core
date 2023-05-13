import { DataObjectClass } from '../../components'
import { UserClass } from '../../components/types/UserClass'
import * as actions from '../../Backend'

export interface InjectMetaMiddlewareParams {
   user: UserClass
}

export class InjectMetaMiddleware {
   protected _user: UserClass

   constructor(params: InjectMetaMiddlewareParams) {
      this._user = params.user
   }

   execute(dataObject: DataObjectClass<any>, action: actions.BackendActions) {
      switch (action) {
         // add properties existence validation
         case actions.CREATE:
            dataObject.set('createdBy', this._user)
            dataObject.set('createdAt', Date.now())
         case actions.UPDATE:
            dataObject.set('updatedBy', this._user)
            dataObject.set('updatedAt', Date.now())
         case actions.DELETE:
            dataObject.set('deletedBy', this._user)
            dataObject.set('deleteddAt', Date.now())
         default:
            break
      }

      return
   }
}
