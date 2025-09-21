import express from "express";
import { createLoggerMiddleware } from "./middlewares/logger-mdw.js";
import authRoute from "./routes/auth-route.js";
import { sm_info } from "../shared/utils/sm_logger.js";

const kApp = express();

kApp.use(createLoggerMiddleware());

// Register routers
kApp.use("auth", authRoute);

kApp.get("/", async (req, res) => {
  res.send("Hi");
});

kApp.listen(33445);
