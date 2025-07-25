import { describe, it, expect, beforeEach } from "vitest"
import { auth } from "../../../src/utils/auth"
import { cleanupDb, testDb } from "../utils/db"

beforeEach(async () => {
  await cleanupDb()
})

describe("sign-up", () => {
  it("should sign up with email and password", async () => {
    await auth.api.signUpEmail({
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
    expect(user?.id).toBeDefined()

    const account = await testDb
      .selectFrom("account")
      .selectAll()
      .where("userId", "=", user!.id)
      .executeTakeFirst()
    console.log(account)
    expect(account?.providerId).toBe("credential")
  })
})
