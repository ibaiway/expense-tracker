import { z } from "zod"
import { db } from "../db/database"
import { AuthenticatedRequest } from "../middlewares/auth"
import { Response } from "express"

const ProjectSchema = z.object({
  name: z.string(),
})

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const { name } = ProjectSchema.parse(req.body)

  const project = await db.transaction().execute(async (trx) => {
    const project = await trx
      .insertInto("project")
      .values({ name })
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
