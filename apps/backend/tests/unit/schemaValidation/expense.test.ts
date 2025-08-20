// tests/unit/expense-schema.test.ts
import { describe, it, expect } from "vitest"
import { ExpenseSchema } from "../../../src/utils/schemas/expense"

const validExpense = {
  title: "Business lunch",
  originalCurrency: "EUR",
  originalAmount: 45.5,
  exchangeRate: 1.15,
  date: "2025-01-15",
}

describe("ExpenseSchema", () => {
  describe("title field", () => {
    it("should accept valid string", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        title: "Valid expense title",
      })
      expect(result.success).toBe(true)
    })

    it("should reject empty string", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        title: "",
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toEqual(["title"])
      expect(result.error?.issues[0].message).toBe("Title is required")
    })

    it("should reject non-string values", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        title: 123,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toEqual(["title"])
      expect(result.error?.issues[0].message).toBe(
        "Invalid input: expected string, received number"
      )
    })
  })

  describe("originalCurrency field", () => {
    it("should accept valid currency codes", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalCurrency: "USD",
      })
      expect(result.success).toBe(true)
    })

    it("should reject empty string", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalCurrency: "",
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        "Currency must be 3 characters"
      )
    })
  })

  describe("originalAmount field", () => {
    it("should accept positive numbers", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalAmount: 100.5,
      })
      expect(result.success).toBe(true)
    })

    it("should reject zero", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalAmount: 0,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Amount must be positive")
    })

    it("should reject negative numbers", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalAmount: -100,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Amount must be positive")
    })

    it("should reject non-numbers", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        originalAmount: "100",
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        "Invalid input: expected number, received string"
      )
    })
  })

  describe("exchangeRate field", () => {
    it("should accept positive numbers", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        exchangeRate: 1.25,
      })
      expect(result.success).toBe(true)
    })

    it("should reject zero", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        exchangeRate: 0,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        "Exchange rate must be positive"
      )
    })

    it("should reject negative numbers", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        exchangeRate: -1.0,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        "Exchange rate must be positive"
      )
    })
  })

  describe("date field", () => {
    it("should accept valid ISO date strings", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        date: "2025-01-15",
      })
      expect(result.success).toBe(true)
    })

    it("should reject invalid date formats", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        date: "15-01-2025",
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid ISO date")
    })

    it("should reject non-date values", () => {
      const result = ExpenseSchema.safeParse({
        ...validExpense,
        date: "not-a-date",
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid ISO date")
    })
  })

  describe("complete schema validation", () => {
    it("should accept valid complete expense", () => {
      const result = ExpenseSchema.safeParse(validExpense)
      expect(result.success).toBe(true)
    })

    it("should reject expense with missing required fields", () => {
      const invalidExpense = {
        ...validExpense,
        originalAmount: undefined,
        exchangeRate: undefined,
        date: undefined,
      }
      const result = ExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
      expect(result.error?.issues).toHaveLength(3)
    })
  })
})
