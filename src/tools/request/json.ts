const regex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/

export async function getJsonPayload(request: Request, headers: Headers) {
  const header = headers.get("Content-Type")
  if (header == null || !regex.test(header)) {
    return { error: "Missing required HTTP header 'Content-Type:application/json'" }
  }
  let body: unknown = ""
  try {
    body = await request.json()
  }
  catch {
    return { error: "Request body contains malformed JSON content" }
  }
  return { body }
}
