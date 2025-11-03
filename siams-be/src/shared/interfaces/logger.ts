export type LogInfo = { msg?: string, obj?: any, tag?: string };

export interface ILogger {
  info(logInfo: LogInfo): void
  info(msg: string): void
  debug(logInfo: LogInfo): void
  debug(msg: string): void
  error(logInfo: LogInfo): void
  error(msg: string): void
  fatal(logInfo: LogInfo): void
  fatal(msg: string): void
  trace(logInfo: LogInfo): void
  trace(msg: string): void
  warn(logInfo: LogInfo): void
  warn(msg: string): void
}
