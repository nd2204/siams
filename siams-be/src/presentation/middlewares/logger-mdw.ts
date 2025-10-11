import { sm_logger_internal } from "@shared/utils/sm_logger.js";
import { pinoHttp } from "pino-http";

export const createLoggerMiddleware = () => {
  return pinoHttp({ logger: sm_logger_internal });
};
