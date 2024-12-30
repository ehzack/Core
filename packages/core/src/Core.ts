import { DataObject } from './components/DataObject'
import { User } from './components/User'
import { DataObjectClass } from './components/types/DataObjectClass'
import logger from 'loglevel'

export class Core {
   static storage = require('node-persist')
   static storagePrefix = 'core'
   static userClass = User
   static classRegistry: { [key: string]: any } = {}
   static logger = logger

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

   protected static formatLogMessage = (message: any) =>
      `${Core.timestamp()} - [${this.name}] ${
         typeof message === 'string' ? message : JSON.stringify(message)
      }`

   /**
    * Log message using defined logger
    * @param message string | object
    * @param level string
    */
   static log(message: any, level: any = logger.levels.WARN): void {
      Core.logger.log(Core.formatLogMessage(message))
   }

   static debug(message: any): void {
      Core.logger.debug(Core.formatLogMessage(message))
   }

   static warn(message: any): void {
      Core.logger.warn(Core.formatLogMessage(message))
   }

   static info(message: any): void {
      Core.logger.info(Core.formatLogMessage(message))
   }

   static error(message: any): void {
      Core.logger.error(Core.formatLogMessage(message))
   }

   static trace(message: any): void {
      Core.logger.trace(Core.formatLogMessage(message))
   }
}
