import type { AppEnv, AppHono } from "./types"

import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { requestId } from "hono/request-id"

import { env } from "@/config/env"
import { logger } from "@/config/logger"

import {
  StatusNotFoundCode,
  StatusNotFoundText,
  StatusRequestEntityTooLargeCode,
  StatusRequestEntityTooLargeText,
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

  app.use("*", bodyLimit({ maxSize: env.BODY_LIMIT_BYTES, onError: ctx => {
    return ctx.json({
      ok: false,
      error: StatusRequestEntityTooLargeText,
      message: `Request body must not be larger than ${env.BODY_LIMIT_BYTES} bytes`,
    }, StatusRequestEntityTooLargeCode)
  } }))

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
