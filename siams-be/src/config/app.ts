import { IAppConfig } from "@domain/interfaces/config";

export const app: IAppConfig = {
  isProduction: (): boolean => {
    return process.env.NODE_ENV === "production";
  },
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET as string,
  feHost: process.env.FE_HOST as string,
  logFile: process.env.LOG_FILE_PATH as string,
  bootLogFile: process.env.BOOT_LOG_FILEPATH as string,
  mqtt: {
    url: process.env.MQTT_URL as string,
  },
  database: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    dbName: process.env.DB_NAME as string,
  },
  beSecret: process.env.BE_SECRET as string
}
