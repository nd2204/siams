// src/infrastructure/api/express/index.ts

import { logger } from '@adapters/http/v1/middlewares'
import { IError } from '@shared/interfaces'
import routes from './routes'
import express from 'express'
import cors from 'cors'
import methodOverride from 'method-override'
import config from '@/config'

const app: express.Application = express()

// import swaggerUi from 'swagger-ui-express'
// import swaggerDocument from '@config/swagger.json'

app.use(logger())
app.use(express.json())
app.use(
  cors({
    origin: ['http://127.0.0.1:33445', 'http://localhost:33445'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
)
app.use(express.urlencoded({ extended: false }))

// if (!config.app.isProduction()) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

routes.attach(app)

app.use((req: express.Request, res: express.Response) => {
  res.status(404).send({
    error: 'NotFound',
    message: `Cannot ${req.method} /${req.baseUrl}`,
  })
})

app.use(methodOverride())
app.use((err: IError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.httpStatus || 500).send({
    error: err.name,
    message: err.message,
    status: err.httpStatus,
    details: err.details,
  })
})

export default app
