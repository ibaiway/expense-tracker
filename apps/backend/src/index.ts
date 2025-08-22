import { config } from "./config/config"
import app from "./server"

async function startServer() {
  try {
    const { port, host } = config.server

    app.listen(port, host, () => {
      console.log(`Backend running on http://${host}:${port}`)
      console.log(`Environment: ${config.env}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
