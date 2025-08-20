import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import request from "supertest"
import app from "../../src/server"
import { cleanupDb, cleanupNonAuthTables } from "./utils/db"
import { getSessionToken } from "./utils/auth"

let sessionToken: string

beforeAll(async () => {
  await cleanupDb()
  const signUpResponse = await request(app)
    .post("/api/auth/sign-up/email")
    .send({
      name: "userA",
      email: "userA@test.com",
      password: "123456789ABCD",
    })
  expect(signUpResponse.status).toBe(200)
  sessionToken = getSessionToken(signUpResponse)
  expect(sessionToken).toBeDefined()
})

beforeEach(async () => {
  await cleanupNonAuthTables()
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

  it("Should get projects the user is a member of", async () => {
    const signUpResponseUserB = await request(app)
      .post("/api/auth/sign-up/email")
      .send({
        name: "userB",
        email: "userB@test.com",
        password: "12345justatest",
      })
    expect(signUpResponseUserB.status).toBe(200)
    const sessionTokenUserB = getSessionToken(signUpResponseUserB)

    const postProjectResponseUserA = await request(app)
      .post("/api/projects")
      .send({
        name: "Project A1",
        baseCurrency: "EUR",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)
    expect(postProjectResponseUserA.status).toBe(200)
    const postProjectResponseUserB = await request(app)
      .post("/api/projects")
      .send({
        name: "Project B1",
        baseCurrency: "EUR",
      })
      .set("Cookie", `better-auth.session_token=${sessionTokenUserB}`)
    expect(postProjectResponseUserB.status).toBe(200)

    const getProjectsResponseUserB = await request(app)
      .get("/api/projects")
      .set("Cookie", `better-auth.session_token=${sessionTokenUserB}`)
    expect(getProjectsResponseUserB.status).toBe(200)
    expect(getProjectsResponseUserB.body).toEqual([
      {
        id: postProjectResponseUserB.body.projectId,
        name: "Project B1",
        baseCurrency: "EUR",
        role: "admin",
      },
    ])
  })
})
