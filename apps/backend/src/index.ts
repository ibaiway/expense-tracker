import app from "./server"

const port = 3001

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
