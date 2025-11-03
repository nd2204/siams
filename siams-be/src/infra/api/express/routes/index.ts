import { Application } from 'express'
import { authRouter } from './auth-router'
import { deviceRouter } from './device-router'
import { userRouter } from './user-router'
import { adminRouter } from './admin-router'
import { organizationRouter } from './organization-router'
import { clusterRouter } from './cluster-router'

const version = "v1"

export default {
  attach(app: Application): void {
    app.use(`/api/${version}/auth`, authRouter())
    app.use(`/api/${version}/users`, userRouter())
    app.use(`/api/${version}/admin`, adminRouter())
    app.use(`/api/${version}/devices`, deviceRouter())
    app.use(`/api/${version}/orgs`, organizationRouter())
    app.use(`/api/${version}/clusters`, clusterRouter())
  },
}
