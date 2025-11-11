import { NextFunction, Request, Response, Router } from "express";
import { getAuthToken } from "../get-auth-token";
import { DeviceController } from "@adapters/http/v1/controllers/device-controller";
import { GetDeviceByIdUC } from "@feature/device/get-by-id";
import { services } from "@config/services";
import { GetAllSensorsUC } from "@feature/device/get-all-sensors";
import { GetAllActuatorsUC } from "@feature/device/get-all-actuators";
import { GetAllCommandsUC } from "@feature/device/get-all-commands";
import { ListTelemetryUC } from "@feature/device/list-telemetry";

const controller = new DeviceController(
  new GetDeviceByIdUC(
    services.authService,
    services.device.validators.getDeviceByIdValidator
  ),
  new GetAllSensorsUC(
    services.device.repositories.sensors,
    services.authService,
    services.device.validators.getAllSensorsValidator
  ),
  new GetAllActuatorsUC(
    services.device.repositories.actuators,
    services.authService,
    services.device.validators.getAllActuatorsValidator
  ),
  new GetAllCommandsUC(
    services.device.repositories.commands,
    services.authService,
    services.device.validators.getAllCommandsValidator
  ),
  new ListTelemetryUC(
    services.device.repositories.telemetry,
    services.authService,
    services.device.validators.listTelemetryValidator
  ),
)

export function deviceRouter(): Router {
  const router = Router();

  router.post("/", async (req, res) => {
    /* TODO: Add new device from the wait list */
  })

  router.get("/:id", async (req, res) => {
    /* TODO: Get device from id */
  });

  router.put("/:id", async (req, res) => {
    /* TODO: Update device with id */
  });

  router.delete("/:id", async (req, res) => {
    /* TODO: Remove device with id */
  });

  router.post("/:id/sensors/:sensorId/telemetry/", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.listTelemetry({
        token: token,
        params: req.params,
        body: req.body
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id/commands", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.getAllCommands({
        token: token,
        params: req.params
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id/actuators", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.getAllActuators({
        token: token,
        params: req.params
      })
      res.send(result)
    } catch (err) {
      return next(err)
    }
  })

  router.get("/:id/sensors", async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = getAuthToken(req)
      const result = await controller.getAllSensors({
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
