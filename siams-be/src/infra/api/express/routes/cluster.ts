import ClusterController from "@/adapters/http/v1/controllers/cluster";
import services from "@/config/services";
import { CreateClusterUC, GetClusterByIdUC, ListClusterUC } from "@feature/cluster";
import { NextFunction, Router, Request, Response } from "express";

const controller = new ClusterController(
  new CreateClusterUC(
    services.cluster.repository,
    services.cluster.validators.createValidator,
  ),
  new GetClusterByIdUC(services.cluster.repository),
  new ListClusterUC(services.cluster.repository)
)

export function clusterRouter(): Router {
  const router = Router();

  router.post("/", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
      const result = await controller.create({
        token: token,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  return router;
}
