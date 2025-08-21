import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./utils/auth"
import routes from "./routes"
import cors from "cors"
import { errorMiddleware } from "./middlewares/error-middleware"

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.get("/", (_req, res) => {
  res.send("Hello from backend!")
})

app.all("/api/auth/{*any}", toNodeHandler(auth))

app.use(express.json()) // This must be after the better-auth handler

app.use("/api", routes)

app.use(errorMiddleware)

export default app
