import { DataObject } from './components/DataObject'
import { User } from './components/User'
import { DataObjectClass } from './components/types/DataObjectClass'

export class Core {
   static storage = require('node-persist')
   static storagePrefix = 'core'
   static userClass = User
   static classRegistry: { [key: string]: any } = {}
   static logger = console

   // How timestamp are formatted
   static timestamp = () => new Date().toISOString()

   static definition(key: string) {
      return {
         manifest: {
            type: String,
            mandatory: true,
         },
      }
   }

   static async addConfig(key: string, value: any) {
      if (!this.storage.set) {
         await this.storage.init()
      }
      await this.storage.set(`${this.storagePrefix}_${key}`, value)
   }

   static async getConfig(key: string) {
      if (!this.storage.get) {
         await this.storage.init()
      }
      return await this.storage.get(`${this.storagePrefix}_${key}`)
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
