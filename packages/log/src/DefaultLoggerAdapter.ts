import { AbstractLoggerAdapter } from './AbstractLoggerAdapter'
import logger from 'loglevel'
import { LogLevel } from './Log'

export class DefaultLoggerAdapter extends AbstractLoggerAdapter {
   constructor(prefix = '', level: LogLevel = LogLevel.WARN) {
      super(prefix, level)
      this._logger = logger
      this._logger.setLevel(level)
   }

   /**
    * Log message using defined logger
    * @param message string | object
    * @param level string
    */
   log(messages: any[], level: LogLevel = this._logLevel): void {
      const message = this.formatLogMessage(messages)

      switch (level) {
         case LogLevel.TRACE:
            this._logger.trace(message)
            break
         case LogLevel.DEBUG:
            this._logger.debug(message)
            break
         case LogLevel.INFO:
            this._logger.info(message)
            break
         case LogLevel.WARN:
            this._logger.warn(message)
            break
         case LogLevel.ERROR:
            this._logger.error(message)
            break
         default:
            this._logger.log(message)
            break
      }
   }

   debug(...messages: any): void {
      this.log(messages, LogLevel.DEBUG)
   }

   warn(...messages: any): void {
      this.log(messages, LogLevel.WARN)
   }

   info(...messages: any): void {
      this.log(messages, LogLevel.INFO)
   }

   error(...messages: any): void {
      this.log(messages, LogLevel.ERROR)
   }

   trace(...messages: any): void {
      this.log(messages, LogLevel.TRACE)
   }
}
