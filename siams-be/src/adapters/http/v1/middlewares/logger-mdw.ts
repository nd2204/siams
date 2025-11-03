import { sm_logger_internal } from "@shared/logger";
import { pinoHttp } from "pino-http";
import config from "@/config"
import pino from "pino";

export function logger() {
  return pinoHttp(
    !config.app.isProduction()
      ? {
        logger: sm_logger_internal
      }
      : {
        logger: pino()
      }
  )
};
