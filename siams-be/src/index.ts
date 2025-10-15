import { sm_info } from "@shared/logger";
import { createServer } from "http";
import config from "@/config"
import app from "@infra/api/express"

const server = createServer(app);
const port: number = config.app.port;

server.listen(port, () => {
  sm_info(`server is running at http://localhost:${port.toString()}`, "app")
});
