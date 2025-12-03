import { http_logger, sm_logger_internal } from "@shared/logger";
import { pinoHttp } from "pino-http";
import config from "@/config"
import pino from "pino";

export function logger() {
  return pinoHttp(
    !config.app.isProduction()
      ? {
        logger: http_logger
      }
      : {
        logger: pino()
      }
  )
};
