import config from '@/config'
import { sm_fatal } from '@/shared/logger'
import { Pool, PoolClient } from 'pg'

const cfg = config.app.database

export const pool = new Pool({
  user: cfg.user,
  password: cfg.password,
  host: cfg.host,
  port: cfg.port,
  database: cfg.dbName,
})

pool.on("error", (error: Error, _client: PoolClient) => {
  sm_fatal({
    msg: "Unexpected error on idle client",
    obj: error,
    tag: "infra:postgres"
  })
})
