import { AbstractAdapter } from './backends/AbstractAdapter'
import { MockAdapter } from './backends/MockAdapter'
import { UserClass } from './components/types/UserClass'

export type BackendRegistry<T extends AbstractAdapter> = { [x: string]: T }

export class Core {
   static defaultBackend = '@default'
   static currentUser: UserClass

   protected static _backends: BackendRegistry<any> = {
      '@mock': new MockAdapter({ alias: '@mock' }),
   }

   static definition(key: string) {
      return {
         manifest: {
            type: String,
            mandatory: true,
         },
      }
   }

   static addBackend(backend: AbstractAdapter, alias: string) {
      Core._backends[alias] = backend
   }

   static getBackend(alias: string = this.defaultBackend) {
      if (this._backends[alias]) {
         return this._backends[alias]
      } else {
         throw new Error(`Unknown backend alias: '${alias}'`)
      }
   }
}
