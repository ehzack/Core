import { DataObject } from './components/DataObject'
import { User } from './components/User'
import { DataObjectClass } from './components/types/DataObjectClass'
import { AbstractLoggerAdapter, DefaultLoggerAdapter, Log, LogLevel } from '@quatrain/log'

export class Core {
   static me = this.name
   static storage = require('node-persist')
   static storagePrefix = 'core'
   static userClass = User
   static classRegistry: { [key: string]: any } = {}
   static logLevel = LogLevel.WARN
   static logger: AbstractLoggerAdapter = this.addLogger()

   static addLogger(alias: string = this.name) {
      return Log.addLogger(
         '@' + alias,
         new DefaultLoggerAdapter(alias, this.logLevel),
         true
      )
   }

   static setLogLevel(level: LogLevel) {
      this.logger.logLevel(level)
   }

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

   static log(...message: any): void {
      return this.logger.log(message)
   }

   static debug(...message: any): void {
      return this.logger.debug(message)
   }

   static warn(...message: any): void {
      return this.logger.warn(message)
   }

   static info(...message: any): void {
      return this.logger.info(message)
   }

   static error(...message: any): void {
      return this.logger.error(message)
   }

   static trace(...message: any): void {
      return this.logger.trace(message)
   }
}
