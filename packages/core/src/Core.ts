import { AbstractAuthAdapter } from './authentication'
import { AbstractAdapter } from './backends/AbstractAdapter'
import { DataObject } from './components/DataObject'
import { User } from './components/User'
import { DataObjectClass } from './components/types/DataObjectClass'

export type BackendRegistry<T extends AbstractAdapter> = { [x: string]: T }

export class Core {
   static defaultBackend = '@default'
   static userClass = User
   static classRegistry: { [key: string]: any } = {}
   static logger = console
   static auth: AbstractAuthAdapter

   // How timestamp are formatted
   static timestamp = () => new Date().toISOString()

   protected static _backends: BackendRegistry<any> = {}

   static definition(key: string) {
      return {
         manifest: {
            type: String,
            mandatory: true,
         },
      }
   }

   static addBackend(
      backend: AbstractAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      Core._backends[alias] = backend
      if (setDefault) {
         Core.defaultBackend = alias
      }
   }

   static getBackend<T extends AbstractAdapter>(
      alias: string = this.defaultBackend
   ): T {
      if (this._backends[alias]) {
         return this._backends[alias]
      } else {
         throw new Error(`Unknown backend alias: '${alias}'`)
      }
   }

   static addClass(name: string, obj: any) {
      Core.classRegistry[name] = obj
   }

   static getClass(name: string) {
      return Core.classRegistry[name]
   }

   /**
    * Returns the class to use for a data object
    * This is currently just a stub that will be implemented from config in the future
    * @returns DataObjectClass
    */
   static getDataObjectClass(): DataObjectClass<any> {
      return DataObject.prototype
   }

   /**
    * Log message using defined logger
    * This is currently just a stub that will be implemented from config in the future
    * @param message string | object
    * @param level string
    */
   static log(
      message: any,
      src: string = 'Core',
      level: string = 'NOTICE'
   ): void {
      Core.logger.log(
         `${Date.now()} - [${src}] ${
            typeof message === 'string' ? message : JSON.stringify(message)
         }`
      )
   }
}
