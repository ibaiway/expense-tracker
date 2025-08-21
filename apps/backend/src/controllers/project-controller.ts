import { z } from "zod"
import { db } from "../db/database"
import { AuthenticatedRequest } from "../middlewares/auth"
import { Response } from "express"
import {
  addProjectAndAddMember,
  getProjectsFromUser,
} from "../services/project-service"
import { updateExpenseById } from "../services/expense-service"
import { ExpenseSchema } from "../utils/schemas/expense"

const ProjectSchema = z.object({
  name: z.string(),
  baseCurrency: z.string(),
})

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  const { userId } = req.session
  const projects = await getProjectsFromUser(userId)
  res.send(projects)
}

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const { name, baseCurrency } = ProjectSchema.parse(req.body)

  const project = await addProjectAndAddMember(
    req.session.userId,
    name,
    baseCurrency
  )
  res.send(project)
}

export async function getExpenses(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params
  const expenses = await db
    .selectFrom("expense")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute()

  return expenses
}

export async function createExpense(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params
  const { title, originalCurrency, originalAmount, exchangeRate, date } =
    ExpenseSchema.parse(req.body)

  const convertedAmount = originalAmount * exchangeRate
  const expense = await db
    .insertInto("expense")
    .values({
      projectId,
      title,
      originalCurrency,
      originalAmount,
      convertedAmount,
      exchangeRate,
      date,
    })
    .returning([
      "id",
      "title",
      "originalCurrency",
      "originalAmount",
      "convertedAmount",
      "exchangeRate",
      "date",
    ])
    .executeTakeFirstOrThrow()
  return expense
}

export async function updateExpense(req: AuthenticatedRequest, res: Response) {
  const { projectId, expenseId } = req.params

  const { title, originalCurrency, originalAmount, exchangeRate, date } =
    ExpenseSchema.parse(req.body)

  const convertedAmount = originalAmount * exchangeRate
  const expense = await updateExpenseById(expenseId, projectId, {
    title,
    originalCurrency,
    originalAmount,
    exchangeRate,
    convertedAmount,
    date,
  })
  res.status(200).send(expense)
}
