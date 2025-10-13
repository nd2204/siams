import { authRouter } from "@adapters/http/v1/routes/auth-route";
import { deviceRouter } from "@adapters/http/v1/routes/device-route";
import { createLoggerMiddleware } from "@shared/middlewares/logger-mdw";
import { sm_info } from "@shared/utils/sm_logger";
import express from "express";
import { createServer } from "http";
// import { dirname, join } from "path";
// import { Server } from "socket.io";
// import { fileURLToPath } from "url";

const kApp = express();
const kServer = createServer(kApp);
const kPort: number = process.env.PORT ? parseInt(process.env.PORT) : 33445;
// const __dirname = dirname(fileURLToPath(import.meta.url));
// const io = new Server(kServer, {
//   connectionStateRecovery: {}
// });

kApp.use(createLoggerMiddleware());

// Register routers
kApp.use("api/v1/auth", authRouter() as express.Router);
kApp.use("api/v1/device", deviceRouter() as express.Router);

kServer.listen(kPort, () => {
  sm_info(`server is running at http://localhost:${kPort.toString()}`, "app")
});
