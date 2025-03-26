import { serve } from "@hono/node-server"

import { app } from "./app"
import { env } from "@/config/env"
import { logger } from "@/config/logger"

serve({
  fetch: app.fetch,
  port: env.APP_PORT,
}, (info) => {
  logger.info("server started", { port: info.port })
})
