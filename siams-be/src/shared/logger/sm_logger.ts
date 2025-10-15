// logger.js
import { pino } from "pino";
import stream from "./sm_logger_transport"
import { ILogger } from "../interfaces/logger";

// Base pino instance
const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.epochTime,
}, stream());

export function sm_debug(msg: any, tag?: string) {
  logger.debug({ tag }, msg);
}
export function sm_error(msg: any, tag?: string) {
  logger.error({ tag }, msg);
}
export function sm_fatal(msg: any, tag?: string) {
  logger.fatal({ tag }, msg);
}
export function sm_info(msg: any, tag?: string) {
  logger.info({ tag }, msg);
}
export function sm_trace(msg: any, tag?: string) {
  logger.trace({ tag }, msg);
}
export function sm_warn(msg: any, tag?: string) {
  logger.warn({ tag }, msg);
}

export class SMLogger implements ILogger {
  // Export wrapper API
  debug(msg: any, tag?: string) { sm_debug(msg, tag) }
  error(msg: any, tag?: string) { sm_error(msg, tag); }
  fatal(msg: any, tag?: string) { sm_fatal(msg, tag); }
  info(msg: any, tag?: string) { sm_info(msg, tag); }
  trace(msg: any, tag?: string) { sm_trace(msg, tag); }
  warn(msg: any, tag?: string) { sm_warn(msg, tag); }
}

export const sm_logger_internal = logger;
