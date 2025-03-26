import { users } from "@/routes/users/handlers"
import { newApp, bootstrap } from "@/app/base"

const app = newApp()
bootstrap(app)

app.route("/api/v1/users", users)

export { app }
