import { z } from "zod"
import { db } from "../db/database"
import { AuthenticatedRequest } from "../middlewares/auth"
import { Response } from "express"

const ProjectSchema = z.object({
  name: z.string(),
})

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const { name } = ProjectSchema.parse(req.body)
  const project = await db
    .insertInto("project")
    .values({ name, createdBy: req.session.userId })
    .returningAll()
    .executeTakeFirst()
  res.send(project)
}
