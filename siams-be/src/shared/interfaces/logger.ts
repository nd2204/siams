export type LogInfo = { msg?: string, obj?: any, tag?: string };

export interface ILogger {
  info(logInfo: LogInfo): void
  debug(logInfo: LogInfo): void
  error(logInfo: LogInfo): void
  fatal(logInfo: LogInfo): void
  trace(logInfo: LogInfo): void
  warn(logInfo: LogInfo): void
}
