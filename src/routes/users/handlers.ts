import { newApp } from "@/app/base"
import { getJsonPayload } from "@/tools/request/json"

import {
  StatusCreatedCode,
  StatusBadRequestCode,
  StatusBadRequestText,
} from "@/app/status"

export const users = newApp()

users.post("/sign-up", async ctx => {
  const { error } = await getJsonPayload(ctx.req.raw, ctx.req.raw.headers)
  if (error != null) {
    return ctx.json({
      ok: false,
      error: StatusBadRequestText,
      message: error,
    }, StatusBadRequestCode)
  }
  return ctx.json({ ok: true }, StatusCreatedCode)
})
