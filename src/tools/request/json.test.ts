import { describe, expect, it } from "vitest"

import { getJsonPayload } from "./json"

describe("request.json", () => {
  it("should return missing headers error", async () => {
    const req = new Request("http://localhost:3000", { method: "POST" })
    const { error } = await getJsonPayload(req, req.headers)
    expect(error).toBe("Missing required HTTP header 'Content-Type:application/json'")
  })
  it("should return malformed json error", async () => {
    const req = new Request("http://localhost:3000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const { error } = await getJsonPayload(req, req.headers)
    expect(error).toBe("Request body contains malformed JSON content")
  })
  it("should return valid body content", async () => {
    const req = new Request("http://localhost:3000", {
      body: JSON.stringify({ email: "test@email.com" }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const { body, error } = await getJsonPayload(req, req.headers)
    expect(error).toBeUndefined()
    expect(body).toHaveProperty("email")
  })
})
