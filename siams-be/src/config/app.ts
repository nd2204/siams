export const app = {
  isProduction: (): boolean => {
    return process.env.NODE_ENV === "production";
  },
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  logFile: process.env.LOG_FILE_PATH,
  database: {
    host: process.env.POSTGRES_HOST as string,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    dbName: process.env.POSTGRES_DB as string,
  }
}
