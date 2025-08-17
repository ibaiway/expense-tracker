import { db } from "../db/database"

export const getExpensesFromProject = async (projectId: string) => {
  const expenses = await db
    .selectFrom("expense")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute()
  return expenses
}
