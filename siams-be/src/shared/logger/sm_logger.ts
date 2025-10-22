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

  private log(logInfo: string | LogInfo, cb: (logInfo: LogInfo) => void) {
    if (typeof logInfo === 'string') {
      cb({ tag: this.tag, msg: logInfo })
    } else {
      if (!logInfo.msg) logInfo.msg = ""
      if (!logInfo.tag) logInfo.tag = this.tag
      cb(logInfo)
    }
  }

  info(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_info)
  }
  debug(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_debug)
  }
  error(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_info)
  }
  fatal(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_fatal)
  }
  trace(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_trace)
  }
  warn(logInfo: string | LogInfo): void {
    this.log(logInfo, sm_warn)
  }
}

export const sm_logger_internal = logger;
