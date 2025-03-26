import type { AppEnv, AppHono } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { logger } from "@/config/logger"

import {
  StatusNotFoundCode,
  StatusNotFoundText,
  StatusInternalServerErrorCode,
  StatusInternalServerErrorText,
} from "./status"

export function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

export function bootstrap(app: AppHono) {
  app.use(requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    await next()
  })

  app.notFound(ctx => {
    return ctx.json({
      ok: false,
      error: StatusNotFoundText,
      message: "The resource you are looking for does not exist",
    }, StatusNotFoundCode)
  })

  app.onError((err, ctx) => {
    ctx.var.logger.error("uncaught exception", {
      error: err.message,
      stack: err.stack,
    })
    return ctx.json({
      ok: false,
      error: StatusInternalServerErrorText,
      message: "Something went wrong while processing your request",
    }, StatusInternalServerErrorCode)
  })
}
