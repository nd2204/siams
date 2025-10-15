import { Application } from 'express'
import { authRouter } from './auth'
import { deviceRouter } from './device'
import { userRouter } from './user'
import { adminRouter } from './admin'
import { clusterRouter } from './cluster'

const version = "v1"

export default {
  attach(app: Application): void {
    app.use(`/api/${version}/auth`, authRouter())
    app.use(`/api/${version}/users`, userRouter())
    app.use(`/api/${version}/admin`, adminRouter())
    app.use(`/api/${version}/devices`, deviceRouter())
    app.use(`/api/${version}/clusters`, clusterRouter())
  },
}
