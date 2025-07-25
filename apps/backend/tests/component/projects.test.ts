import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "../../src/server"
import { cleanupDb } from "./utils/db"

beforeEach(async () => {
  await cleanupDb()
})

const getSessionToken = (response: any) => {
  const cookie = response.headers["set-cookie"]
  const sessionToken = cookie?.find((c) =>
    c.startsWith("better-auth.session_token=")
  )
  if (!sessionToken) {
    return null
  }
  return sessionToken.split("=")[1]?.split(";")[0]
}

describe("projects", () => {
  it("Should create a project", async () => {
    const signUpResponse = await request(app)
      .post("/api/auth/sign-up/email")
      .send({
        name: "nametest",
        email: "test@test.com",
        password: "12345justatest",
      })
    expect(signUpResponse.status).toBe(200)
    console.log(signUpResponse.headers)
    const sessionToken = getSessionToken(signUpResponse)
    expect(sessionToken).toBeDefined()

    const projectResponse = await request(app)
      .post("/api/projects")
      .send({
        name: "projecttest",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)
    expect(projectResponse.status).toBe(200)
    console.log(projectResponse.body)
    expect(projectResponse.body.projectId).toBeDefined()
  })
})
