export const app = {
  isProduction: (): boolean => {
    return process.env.NODE_ENV === "production";
  },
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  logFile: process.env.LOG_FILE_PATH,
  bootLogFile: process.env.BOOT_LOG_FILEPATH,
  database: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    dbName: process.env.DB_NAME as string,
  }
}
