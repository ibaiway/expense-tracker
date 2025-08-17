import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import app from "../../src/server"
import { cleanupDb, testDb } from "./utils/db"
import { getSessionToken } from "./utils/auth"
import { addProjectAndAddMember } from "../../src/services/project-service"

beforeEach(async () => {
  await cleanupDb()
})

describe("expenses", () => {
  it("should require authentication to create an expense", async () => {
    const expenseResponse = await request(app)
      .post("/api/projects/1/expenses")
      .send({
        title: "expense",
      })
    expect(expenseResponse.status).toBe(401)
    expect(expenseResponse.body.error).toBe("Unauthorized")
  })

  it("should create an expense", async () => {
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

    const { id: projectId } = await testDb
      .insertInto("project")
      .values({
        name: "projecttest",
        baseCurrency: "EUR",
      })
      .returning("id")
      .executeTakeFirstOrThrow()

    await testDb
      .insertInto("project_members")
      .values({
        projectId: projectId,
        userId: signUpResponse.body.user.id,
        role: "admin",
      })
      .executeTakeFirstOrThrow()

    const expenseResponse = await request(app)
      .post(`/api/projects/${projectId}/expenses`)
      .send({
        title: "potatos",
        originalCurrency: "EUR",
        originalAmount: 100,
        exchangeRate: 1,
        date: "2025-09-23",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)

    expect(expenseResponse.body).toStrictEqual({
      id: expect.any(String),
      title: "potatos",
      originalCurrency: "EUR",
      originalAmount: "100.000",
      exchangeRate: "1.000000",
      convertedAmount: "100.000",
      date: "2025-09-22T22:00:00.000Z",
    })
    expect(expenseResponse.status).toBe(200)
  })

  it("should get expenses", async () => {
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

    const { projectId } = await addProjectAndAddMember(
      signUpResponse.body.user.id,
      "projecttest",
      "EUR"
    )

    const expenseResponse = await request(app)
      .post(`/api/projects/${projectId}/expenses`)
      .send({
        title: "potatos",
        originalCurrency: "EUR",
        originalAmount: 100,
        exchangeRate: 1,
        date: "2025-09-23",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)

    expect(expenseResponse.status).toBe(200)

    const getExpensesResponse = await request(app)
      .get(`/api/projects/${projectId}/expenses`)
      .set("Cookie", `better-auth.session_token=${sessionToken}`)

    expect(getExpensesResponse.status).toBe(200)
    expect(getExpensesResponse.body).toEqual([
      {
        id: expect.any(String),
        projectId: projectId,
        title: "potatos",
        originalCurrency: "EUR",
        originalAmount: "100.000",
        exchangeRate: "1.000000",
        convertedAmount: "100.000",
        date: "2025-09-22T22:00:00.000Z",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ])
  })
})
