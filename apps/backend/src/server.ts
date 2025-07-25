import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./utils/auth"
import routes from "./routes"

const app = express()

app.get("/", (_req, res) => {
  res.send("Hello from backend!")
})

app.all("/api/auth/{*any}", toNodeHandler(auth))

app.use(express.json()) // This must be after the better-auth handler

app.use("/api", routes)

export default app
