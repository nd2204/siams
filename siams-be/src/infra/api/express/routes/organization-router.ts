import { services } from "@/config/services";
import { getAuthToken } from "@infra/api/express/get-auth-token";
import { OrganizationController } from "@adapters/http/v1/controllers/organization-controller";
import { NextFunction, Router, Request, Response } from "express";
import { CreateOrganizationUC } from "@feature/organization/create-org";
import { GetOrganizationByIdUC } from "@feature/organization/get-org-by-id";
import { GetClusterByIdUC } from "@feature/cluster/get-by-id";
import { ListClusterByOrgIdUC } from "@feature/cluster/list-clusters-by-org-id";
import { ListDeviceByOrgIdUC } from "@feature/device/list-by-org-id";

const controller = new OrganizationController(
  new CreateOrganizationUC(
    services.organization.repositories.base,
    services.organization.repositories.user,
    services.user.repositories.base,
    services.user.repositories.role,
    services.organization.validators.createOrganizationValidator
  ),
  new GetOrganizationByIdUC(services.organization.repositories.base),
  new ListClusterByOrgIdUC(
    services.cluster.repositories.base,
    services.organization.repositories.user,
    services.cluster.validators.listClusterByOrgIdValidator,
    services.utils.verifyToken
  ),
  new ListDeviceByOrgIdUC(
    services.organization.repositories.user,
    services.device.repositories.base,
    services.organization.validators.listDeviceByOrgIdValidator,
    services.utils.verifyToken
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


  router.post("/:id/devices", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.listDeviceByOrgId({
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

  return router;
}
