export interface IAppConfig {
  isProduction: () => boolean;
  port: number;
  jwtSecret: string,
  feHost: string,
  logFile: string,
  bootLogFile: string,
  beSecret: string,
  mqtt: { url: string },
  database: {
    host: string,
    port: number,
    user: string,
    password: string,
    dbName: string,
  }
}
