import { Log, LogLevel } from './Log'

export interface LoggerType {
   log(message: string): void
   debug(message: string): void
   warn(message: string): void
   info(message: string): void
   error(message: string): void
   trace(message: string): void
}

export const loglevelNames = [
   'TRACE',
   'DEBUG',
   'INFO',
   'WARN',
   'ERROR',
   'SILENT',
]

export abstract class AbstractLoggerAdapter implements LoggerType {
   protected _me: string = ''
   protected _logLevel: LogLevel = LogLevel.WARN
   protected _logger: any = undefined

   constructor(prefix = '', level: LogLevel = LogLevel.WARN) {
      this._me = prefix
      this.logLevel(level)
   }

   logLevel(level: LogLevel) {
      this._logLevel = level
   }

   formatLogMessage = (messages: any[], loglevel: LogLevel = 3): string =>
      `${Log.timestamp()} - [${this._me}] ${messages.reduce((message: any) =>
         typeof message === 'string'
            ? `${message} `
            : `${JSON.stringify(message)} `
      )}`

   /**
    * Log message using defined logger
    * @param message string | object
    * @param level string
    */
   log(...messages: any): void {}

   debug(message: any): void {}

   warn(message: any): void {}

   info(message: any): void {}

   error(message: any): void {}

   trace(message: any): void {}
}
