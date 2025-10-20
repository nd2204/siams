import { services } from "@/config/services";
import { getAuthToken } from "@infra/api/express/get-auth-token";
import { OrganizationController } from "@adapters/http/v1/controllers/organization-controller";
import { CreateOrganizationUC, GetOrganizationByIdUC } from "@feature/organization";
import { CreateClusterUC, GetClusterByIdUC, ListClusterByOrgIdUC } from "@feature/cluster";
import { NextFunction, Router, Request, Response } from "express";

const controller = new OrganizationController(
  new CreateOrganizationUC(
    services.organization.repository,
    services.user.repository,
    services.organization.validators.createOrganizationValidator
  ),
  new GetOrganizationByIdUC(services.organization.repository),
  new CreateClusterUC(
    services.cluster.repository,
    services.clusterCredential.repository,
    services.cluster.validators.createClusterValidator,
    services.utils.encryptPassword
  ),
  new GetClusterByIdUC(services.cluster.repository),
  new ListClusterByOrgIdUC(
    services.cluster.repository,
    services.cluster.validators.listClusterByOrgIdValidator
  )
)

export function organizationRouter(): Router {
  const router = Router();

  router.post("/", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.create({
        token: token,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.getById({
        token: token,
        params: req.params
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id/clusters", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.listClusterByOrgId({
        token: token,
        params: req.params,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.post("/:id/clusters", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.createCluster({
        token: token,
        params: req.params,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id/clusters/:clusterId", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.getClusterById({
        token: token,
        params: req.params,
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  return router;
}
