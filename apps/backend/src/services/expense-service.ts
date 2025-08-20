import { db } from "../db/database"
import { ExpenseUpdate } from "../types/database"

export const getExpensesFromProject = async (projectId: string) => {
  const expenses = await db
    .selectFrom("expense")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute()
  return expenses
}

export const updateExpenseById = async (
  expenseId: string,
  projectId: string,
  expense: ExpenseUpdate
) => {
  const updatedExpense = await db
    .updateTable("expense")
    .set({
      ...expense,
      updatedAt: new Date(),
    })
    .where("id", "=", expenseId)
    .where("projectId", "=", projectId)
    .returningAll()
    .executeTakeFirstOrThrow()
  return updatedExpense
}
