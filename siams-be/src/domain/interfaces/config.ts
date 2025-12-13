export interface IAppConfig {
  isProduction: () => boolean;
  port: number;
  jwtSecret: string,
  feHost: string,
  logFile: string,
  bootLogFile: string,
  beSecret: string,
  email: {
    host: string,
    port: number,
    secure: boolean,
    user: string,
    pass: string,
    from: string
  },
  mqtt: { url: string },
  database: {
    host: string,
    port: number,
    user: string,
    password: string,
    dbName: string,
  },
  blockchain: {
    contractAddr: string,
    providerUrl: string,
    privateKey: string
  }
}
