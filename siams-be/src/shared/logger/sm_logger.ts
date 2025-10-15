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
  logger.debug({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}
export function sm_error(logInfo: LogInfo) {
  logger.error({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}
export function sm_fatal(logInfo: LogInfo) {
  logger.fatal({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}
export function sm_info(logInfo: LogInfo) {
  logger.info({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}
export function sm_trace(logInfo: LogInfo) {
  logger.trace({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}
export function sm_warn(logInfo: LogInfo) {
  logger.warn({ tag: logInfo.tag, msg: logInfo.msg }, logInfo.obj);
}

export class SMLogger implements ILogger {
  info(logInfo: LogInfo): void { sm_info(logInfo) }
  debug(logInfo: LogInfo): void { sm_debug(logInfo) }
  error(logInfo: LogInfo): void { sm_error(logInfo) }
  fatal(logInfo: LogInfo): void { sm_fatal(logInfo) }
  trace(logInfo: LogInfo): void { sm_trace(logInfo) }
  warn(logInfo: LogInfo): void { sm_warn(logInfo) }
  // Export wrapper API
}

export const sm_logger_internal = logger;
