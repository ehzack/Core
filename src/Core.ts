import { MockAdapter, AbstractAdapter } from './backends'

export type BackendRegistry<T extends AbstractAdapter> = { [x: string]: T }

export class Core {
   static defaultBackend = '@default'

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

   // static getClass<T extends TTMObject>(
   //    collection: string,
   //    throwError: boolean = true
   // ): T {
   //    if (!classMap[collection] && throwError === true) {
   //       throw TypeError(`Can't match collection '${collection} with any model`)
   //    }
   //    return classMap[collection] || undefined
   // }

   // static __<T extends TTMObject>(dataObject: DataObject): T {
   //    const [collection] = dataObject.path.split('/')
   //    const objectClass: any = this.getClass(collection)

   //    const obj = new objectClass(dataObject)
   //    obj.backend = this

   //    return obj
   // }
}
