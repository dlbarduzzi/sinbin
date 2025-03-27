import { newApp } from "@/app/base"
import { signUpSchema } from "./schemas"
import { getJsonPayload } from "@/tools/request/json"
import { findUserByEmail, saveUser } from "./queries"

import {
  StatusCreatedCode,
  StatusBadRequestCode,
  StatusBadRequestText,
  StatusUnprocessableEntityCode,
  StatusUnprocessableEntityText,
  StatusInternalServerErrorText,
  StatusInternalServerErrorCode,
} from "@/app/status"

export const users = newApp()

users.post("/sign-up", async ctx => {
  const { body, error } = await getJsonPayload(ctx.req.raw, ctx.req.raw.headers)
  if (error != null) {
    return ctx.json({
      ok: false,
      error: StatusBadRequestText,
      message: error,
    }, StatusBadRequestCode)
  }

  const parsed = signUpSchema.safeParse(body)
  if (!parsed.success) {
    return ctx.json({
      ok: false,
      error: StatusUnprocessableEntityText,
      fields: parsed.error.flatten().fieldErrors,
    }, StatusUnprocessableEntityCode)
  }

  const user = await findUserByEmail(parsed.data.email)
  if (user != null) {
    return ctx.json({
      ok: false,
      error: StatusUnprocessableEntityText,
      message: "This email is already registered",
    }, StatusUnprocessableEntityCode)
  }

  const newUser = await saveUser(parsed.data.email, parsed.data.password)
  if (newUser == null) {
    return ctx.json({
      ok: false,
      error: StatusInternalServerErrorText,
      message: "Something went wrong while processing your request",
    }, StatusInternalServerErrorCode)
  }

  // TODO: Send email verification.
  // Do not authenticate or create session until user verifies email.

  return ctx.json({ ok: true, user: newUser }, StatusCreatedCode)
})
