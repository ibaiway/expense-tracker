import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "../../src/server"
import { cleanupDb } from "./utils/db"
import { getSessionToken } from "./utils/auth"

beforeEach(async () => {
  await cleanupDb()
})

describe("projects", () => {
  it("should require authentication to create a project", async () => {
    const projectResponse = await request(app).post("/api/projects").send({
      name: "projecttest",
    })
    expect(projectResponse.status).toBe(401)
    expect(projectResponse.body.error).toBe("Unauthorized")
  })

  it("Should create a project", async () => {
    const signUpResponse = await request(app)
      .post("/api/auth/sign-up/email")
      .send({
        name: "nametest",
        email: "test@test.com",
        password: "12345justatest",
      })
    expect(signUpResponse.status).toBe(200)
    const sessionToken = getSessionToken(signUpResponse)
    expect(sessionToken).toBeDefined()

    const projectResponse = await request(app)
      .post("/api/projects")
      .send({
        name: "projecttest",
        baseCurrency: "EUR",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)

    expect(projectResponse.status).toBe(200)
    expect(projectResponse.body.projectId).toBeDefined()
  })
})
