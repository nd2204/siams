import services from "@/config/services";
import OrganizationController from "@adapters/http/v1/controllers/organization-controller";
import { CreateOrganizationUC, GetOrganizationByIdUC } from "@feature/organization";
import { NextFunction, Router, Request, Response } from "express";
import { getAuthToken } from "../get-auth-token";

const controller = new OrganizationController(
  new CreateOrganizationUC(
    services.organization.repository,
    services.user.repository,
    services.organization.validators.createOrganizationValidator
  ),
  new GetOrganizationByIdUC(services.organization.repository)
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

  return router;
}
