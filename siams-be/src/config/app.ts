import { IAppConfig } from "@domain/interfaces/config";

export const app: IAppConfig = {
  isProduction: (): boolean => {
    return process.env.NODE_ENV === "production";
  },
  port: Number(process.env.PORT || 44556),
  jwtSecret: process.env.JWT_SECRET as string,
  feHost: process.env.FE_HOST as string,
  logFile: process.env.LOG_FILE_PATH as string,
  bootLogFile: process.env.BOOT_LOG_FILEPATH as string,
  email: {
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    from: process.env.EMAIL_FROM || "noreply@siams.com"
  },
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
  blockchain: {
    contractAddr: process.env.ETHEREUM_CONTRACT_ADDRESS as string,
    providerUrl: process.env.ETHEREUM_PROVIDER_URL as string,
    privateKey: process.env.ETHEREUM_PRIVATE_KEY as string
  },
  beSecret: process.env.BE_SECRET as string
}
