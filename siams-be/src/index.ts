import { sm_error, sm_info } from "@shared/logger";
import { createServer } from "http";
import config from "@/config"
import app from "@infra/api/express"
import { mqttClient } from "@infra/api/mqtt"
import { outboxWorker } from "@infra/worker";
import { socketClient } from "@infra/api/realtime";

async function main() {
  const server = createServer(app);
  const port: number = config.app.port;

  await mqttClient.connect();
  outboxWorker.start(mqttClient);
  socketClient.start(server);

  server.listen(port, () => {
    sm_info({ msg: `server is running at http://localhost:${port.toString()}`, tag: "main" })
  });
}

main().catch(err => {
  sm_error({ obj: err, tag: "app" });
  process.exit(1);
});
