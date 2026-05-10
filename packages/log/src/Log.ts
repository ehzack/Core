import { AbstractLoggerAdapter, LogLevel } from './AbstractLoggerAdapter'
import { DefaultLoggerAdapter } from './DefaultLoggerAdapter'

export type LoggerRegistry<T extends AbstractLoggerAdapter> = {
   [x: string]: T
}
/**
 * Global static registry and entrypoint for logging in Quatrain.
 * Manages instantiated logger adapters.
 */
export class Log {
   /** Alias for the active default logger. */
   static defaultLogger = '@default'

   protected static _loggers: LoggerRegistry<any> = {}

   // How timestamp are formatted
   /**
    * Centralized formatting for log timestamps.
    * 
    * @returns The ISO date string.
    */
   static timestamp() {
      return new Date().toISOString()
   }

   /**
    * Registers a new initialized logger context within the singleton context.
    * 
    * @param alias - Short identifier name.
    * @param logger - The concrete logger instance.
    * @param setDefault - Makes this instance the new default target.
    * @returns The newly added logger.
    */
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

   /**
    * Looks up an existing logger by alias.
    * 
    * @param alias - Required name.
    * @returns The located Logger adapter.
    */
   static getLogger<T extends AbstractLoggerAdapter>(
      alias: string = this.defaultLogger
   ): T {
      if (alias === '@default' && !this._loggers['@default']) {
         this._loggers['@default'] = new DefaultLoggerAdapter()
      }

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
   static log(...messages: any[]): void {
      return Log.getLogger().log(...messages)
   }

   /**
    * Delegate debug call to the default logger.
    * 
    * @param messages - Variadic arguments to log.
    */
   static debug(...messages: any[]): void {
      return Log.getLogger().debug(...messages)
   }

   /**
    * Delegate warning call to the default logger.
    * 
    * @param messages - Variadic arguments to log.
    */
   static warn(...messages: any[]): void {
      return Log.getLogger().warn(...messages)
   }

   /**
    * Delegate info call to the default logger.
    * 
    * @param messages - Variadic arguments to log.
    */
   static info(...messages: any[]): void {
      return Log.getLogger().info(...messages)
   }

   /**
    * Delegate error call to the default logger.
    * 
    * @param messages - Variadic arguments to log.
    */
   static error(...messages: any[]): void {
      return Log.getLogger().error(...messages)
   }

   /**
    * Delegate trace call to the default logger.
    * 
    * @param messages - Variadic arguments to log.
    */
   static trace(...messages: any[]): void {
      return Log.getLogger().trace(...messages)
   }
}

export { LogLevel }
