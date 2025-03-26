import { serve } from "@hono/node-server"
import { Hono } from "hono"

import { env } from "@/config/env"
import { logger } from "@/config/logger"

const app = new Hono()

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

serve({
  fetch: app.fetch,
  port: env.APP_PORT,
}, (info) => {
  logger.info("server started", { port: info.port })
})
