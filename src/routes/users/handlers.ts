import { newApp } from "@/app/base"
import { StatusCreatedCode } from "@/app/status"

export const users = newApp()

users.post("/sign-up", ctx => {
  return ctx.json({ ok: true }, StatusCreatedCode)
})
