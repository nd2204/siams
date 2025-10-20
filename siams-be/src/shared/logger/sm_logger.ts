// logger.js
import { pino } from "pino";
import stream from "./sm_logger_transport"
import { ILogger, LogInfo } from "@shared/interfaces/logger";

// Base pino instance
const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.epochTime,
}, stream());

export function sm_debug(logInfo: LogInfo) {
  logger.debug({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}
export function sm_error(logInfo: LogInfo) {
  logger.error({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}
export function sm_fatal(logInfo: LogInfo) {
  logger.fatal({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}
export function sm_info(logInfo: LogInfo) {
  logger.info({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}
export function sm_trace(logInfo: LogInfo) {
  logger.trace({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}
export function sm_warn(logInfo: LogInfo) {
  logger.warn({ tag: logInfo.tag, obj: logInfo.obj }, logInfo.msg);
}

export class SMLogger implements ILogger {
  constructor(
    public readonly tag?: string
  ) { }

  info(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_info(logInfo)
  }
  debug(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_debug(logInfo)
  }
  error(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_error(logInfo)
  }
  fatal(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_fatal(logInfo)
  }
  trace(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_trace(logInfo)
  }
  warn(logInfo: LogInfo): void {
    if (!logInfo.tag) logInfo.tag = this.tag
    sm_warn(logInfo)
  }
}

export const sm_logger_internal = logger;
