import { createLoggerMiddleware } from "@presentation/middlewares/logger-mdw.js";
import authRoute from "@presentation/routes/auth-route.js";
import { sm_info } from "@shared/utils/sm_logger.js";
import express from "express";

const kApp = express();
const kPort: number = process.env.PORT ? parseInt(process.env.PORT) : 33445;

kApp.use(createLoggerMiddleware());

// Register routers
kApp.use("auth", authRoute);

kApp.get("/", async (req, res) => {
  res.send("Hi");
});

sm_info(`listening on port ${kPort.toString()}`, "app")
kApp.listen(kPort);
