import { Core } from '@quatrain/core'

export class CloudWrapper extends Core {
   static log(message: any, src = 'Cloud') {
      super.log(message, src)
   }
}
