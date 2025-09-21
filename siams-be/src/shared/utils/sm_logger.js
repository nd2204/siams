// logger.js
import pino, { stdTimeFunctions } from "pino";

// Base pino instance
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: stdTimeFunctions.epochTime,
  transport: {
    target: "./sm_logger_transport",
    options: {
      colorize: true, // optional
    },
  },
});

// Export wrapper API
export function sm_trace(msg, tag) {
  return logger.trace({ tag }, msg);
}
export function sm_debug(msg, tag) {
  return logger.debug({ tag }, msg);
}
export function sm_info(msg, tag) {
  return logger.info({ tag }, msg);
}
export function sm_warn(msg, tag) {
  return logger.warn({ tag }, msg);
}
export function sm_error(msg, tag) {
  return logger.error({ tag }, msg);
}
export function sm_fatal(msg, tag) {
  return logger.fatal({ tag }, msg);
}

export const sm_logger_internal = logger;
