import { Router, Request, Response, NextFunction } from "express";
import { getAuthToken } from "../get-auth-token";
import { ClusterController } from "@adapters/http/v1/controllers/cluster-controller";
import { GetClusterByIdUC } from "@feature/cluster/get-by-id";
import { services } from "@config/services";
import { ListDeviceByClusterIdUC } from "@feature/device/list-by-cluster-id";
import { CreateClusterUC } from "@feature/cluster/create-cluster";

const controller = new ClusterController(
  new GetClusterByIdUC(
    services.cluster.repositories.base,
    services.organization.repositories.user,
    services.cluster.validators.getClusterValidator,
    services.utils.verifyToken
  ),
  new CreateClusterUC(
    services.cluster.repositories.base,
    services.cluster.repositories.credential,
    services.cluster.validators.createClusterValidator,
    services.utils.encryptPassword
  ),
  new ListDeviceByClusterIdUC(
    services.organization.repositories.user,
    services.cluster.repositories.base,
    services.device.repositories.base,
    services.cluster.validators.listDevicesByClusterIdValidator,
    services.utils.verifyToken
  )
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

  router.post("/", async (
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

  router.post("/:id/devices", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.listDevices({
        token: token,
        params: req.params,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  return router
}
