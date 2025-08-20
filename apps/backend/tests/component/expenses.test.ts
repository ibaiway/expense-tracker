import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import request from "supertest"
import app from "../../src/server"
import { cleanupDb, cleanupNonAuthTables, testDb } from "./utils/db"
import { getSessionToken } from "./utils/auth"
import { addProjectAndAddMember } from "../../src/services/project-service"

let sessionToken: string
let userId: string

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
  userId = signUpResponse.body.user.id
})

beforeEach(async () => {
  await cleanupNonAuthTables()
})

describe("expenses", () => {
  it("POST: should require authentication to create an expense", async () => {
    const expenseResponse = await request(app)
      .post("/api/projects/1/expenses")
      .send({
        title: "expense",
      })
    expect(expenseResponse.status).toBe(401)
    expect(expenseResponse.body.error).toBe("Unauthorized")
  })

  it("POST: should create an expense", async () => {
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
        userId: userId,
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

  it("GET: should require authentication to get expenses", async () => {
    const getExpensesResponse = await request(app).get(
      "/api/projects/1/expenses"
    )
    expect(getExpensesResponse.status).toBe(401)
    expect(getExpensesResponse.body.error).toBe("Unauthorized")
  })

  it("GET: should get expenses", async () => {
    const { projectId } = await addProjectAndAddMember(
      userId,
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

  it("PUT: should require authentication to update an expense", async () => {
    const updateExpenseResponse = await request(app)
      .put("/api/projects/1/expenses/1")
      .send({
        title: "potatos",
      })
    expect(updateExpenseResponse.status).toBe(401)
    expect(updateExpenseResponse.body.error).toBe("Unauthorized")
  })

  it("PUT: should update an expense", async () => {
    const { projectId } = await addProjectAndAddMember(
      userId,
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

    const updateExpenseResponse = await request(app)
      .put(`/api/projects/${projectId}/expenses/${expenseResponse.body.id}`)
      .send({
        title: "potatos2",
        originalCurrency: "EUR",
        originalAmount: 100,
        exchangeRate: 1,
        date: "2025-09-23",
      })
      .set("Cookie", `better-auth.session_token=${sessionToken}`)
    expect(updateExpenseResponse.status).toBe(200)
    expect(updateExpenseResponse.body).toStrictEqual({
      id: expect.any(String),
      projectId: projectId,
      title: "potatos2",
      originalCurrency: "EUR",
      originalAmount: "100.000",
      exchangeRate: "1.000000",
      convertedAmount: "100.000",
      date: "2025-09-22T22:00:00.000Z",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(updateExpenseResponse.body.updatedAt).not.toEqual(
      updateExpenseResponse.body.createdAt
    )
  })
})
