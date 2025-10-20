import { Router, Request, Response, NextFunction } from "express";
import { getAuthToken } from "../get-auth-token";
import { ClusterController } from "@adapters/http/v1/controllers/cluster-controller";
import { GetClusterByIdUC } from "@feature/cluster";
import { services } from "@config/services";

const controller = new ClusterController(
  new GetClusterByIdUC(
    services.cluster.repository
  ),
)

export function clusterRouter() {
  const router = Router()

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

  return router
}
