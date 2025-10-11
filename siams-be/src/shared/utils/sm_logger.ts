// logger.js
import { pino } from "pino";

// Base pino instance
const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.epochTime,
  transport: {
    options: {
      colorize: true, // optional
    },
    target: "./sm_logger_transport",
  },
});

// Export wrapper API
export function sm_debug(msg: string, tag: string) {
  logger.debug({ tag }, msg);
}
export function sm_error(msg: string, tag: string) {
  logger.error({ tag }, msg);
}
export function sm_fatal(msg: string, tag: string) {
  logger.fatal({ tag }, msg);
}
export function sm_info(msg: string, tag: string) {
  logger.info({ tag }, msg);
}
export function sm_trace(msg: string, tag: string) {
  logger.trace({ tag }, msg);
}
export function sm_warn(msg: string, tag: string) {
  logger.warn({ tag }, msg);
}

export const sm_logger_internal = logger;
