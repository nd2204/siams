export interface ILogger {
  info(msg: any, tag?: string): void
  debug(msg: any, tag?: string): void
  error(msg: any, tag?: string): void
  fatal(msg: any, tag?: string): void
  info(msg: any, tag?: string): void
  trace(msg: any, tag?: string): void
  warn(msg: any, tag?: string): void
}
