import z from "zod"

export const ExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  originalCurrency: z.string().length(3, "Currency must be 3 characters"),
  originalAmount: z.number().positive("Amount must be positive"),
  exchangeRate: z.number().positive("Exchange rate must be positive"),
  date: z.iso.date(),
})
