import { Application } from 'express'
import { authRouter } from './auth-router'
import { deviceRouter } from './device-router'
import { userRouter } from './user-router'
import { adminRouter } from './admin-router'
import { organizationRouter } from './organization-router'
import { clusterRouter } from './cluster-router'
import express from 'express'

const version = "v1"

export default {
  attach(app: Application): void {
    app.use(`/api/${version}/auth`, authRouter())
    app.use(`/api/${version}/users`, userRouter())
    app.use(`/api/${version}/admin`, adminRouter())
    app.use(`/api/${version}/devices`, deviceRouter())
    app.use(`/api/${version}/orgs`, organizationRouter())
    app.use(`/api/${version}/clusters`, clusterRouter())

    // CSRF token endpoint - frontend can call this to get the current token
    app.get(`/api/${version}/csrf-token`, (req: express.Request, res: express.Response) => {
      try {
        // req.csrfToken() will generate a token and also set the cookie
        const token = (req as any).csrfToken && (req as any).csrfToken();
        res.json({ csrfToken: token });
      } catch (err) {
        res.status(500).json({ error: 'Failed to generate csrf token' });
      }
    });
  },
}
