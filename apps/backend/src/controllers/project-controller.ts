import { z } from "zod"
import { db } from "../db/database"
import { AuthenticatedRequest } from "../middlewares/auth"
import { Response } from "express"
import { getProjectsFromUser } from "../services/project-service"

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

  const project = await db.transaction().execute(async (trx) => {
    const project = await trx
      .insertInto("project")
      .values({ name, baseCurrency })
      .returningAll()
      .executeTakeFirstOrThrow()

    return await trx
      .insertInto("project_members")
      .values({
        projectId: project.id,
        userId: req.session.userId,
        role: "admin",
      })
      .returning(["projectId", "userId", "role"])
      .executeTakeFirstOrThrow()
  })
  return project
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

const ExpenseSchema = z.object({
  title: z.string(),
  originalCurrency: z.string(),
  originalAmount: z.number(),
  exchangeRate: z.number(),
  date: z.iso.date(),
})

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
