import { describe, it, expect, beforeAll } from "vitest"
import request from "supertest"
import app from "../../../src/server"
import { auth } from "../../../src/utils/auth"
import { cleanupDb, testDb } from "../utils/db"

beforeAll(async () => {
  await cleanupDb()
})

describe("sign-up", () => {
  it("should sign up with email and password", async () => {
    const { headers, response } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: "test@test.com",
        password: "12345justatest",
        name: "test",
      },
    })

    const user = await testDb
      .selectFrom("user")
      .selectAll()
      .where("email", "=", "test@test.com")
      .executeTakeFirst()
    expect(user?.email).toBe("test@test.com")
    expect(user?.name).toBe("test")

    /**
     * 
     *     expect(response.user.email).toBe("test@test.com")
    expect(response.user.name).toBe("test")
    expect(response.user.emailVerified).toBe(false)
    expect(response.user.image).toBe(null)
    expect(response.user.createdAt).toBeDefined()
    expect(response.user.updatedAt).toBeDefined()
     */
  })
})
