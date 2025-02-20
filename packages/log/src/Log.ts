import { AbstractLoggerAdapter } from './AbstractLoggerAdapter'
import { DefaultLoggerAdapter } from './DefaultLoggerAdapter'

export enum LogLevel {
   TRACE = 0,
   DEBUG = 1,
   INFO = 2,
   WARN = 3,
   ERROR = 4,
   SILENT = 5,
}

export type LoggerRegistry<T extends AbstractLoggerAdapter> = {
   [x: string]: T
}
export class Log {
   static defaultLogger = '@default'

   protected static _loggers: LoggerRegistry<any> = {
      '@default': new DefaultLoggerAdapter(),
   }

   // How timestamp are formatted
   static timestamp() {
      return new Date().toISOString()
   }

   static addLogger(
      alias: string,
      logger: AbstractLoggerAdapter = new DefaultLoggerAdapter(),
      setDefault: boolean = false
   ) {
      this._loggers[alias] = logger
      if (setDefault) {
         this.defaultLogger = alias
      }

      return this._loggers[alias]
   }

   static getLogger<T extends AbstractLoggerAdapter>(
      alias: string = this.defaultLogger
   ): T {
      if (this._loggers[alias]) {
         return this._loggers[alias]
      } else {
         throw new Error(`Unknown logger alias: '${alias}'`)
      }
   }

   /**
    * Log message using defined logger
    * @param message string | object
    */
   static log(message: any): void {
      return Log.getLogger().log(message)
   }

   static debug(message: any): void {
      return Log.getLogger().debug(message)
   }

   static warn(message: any): void {
      return Log.getLogger().warn(message)
   }

   static info(message: any): void {
      return Log.getLogger().info(message)
   }

   static error(message: any): void {
      return Log.getLogger().error(message)
   }

   static trace(message: any): void {
      return Log.getLogger().trace(message)
   }
}
