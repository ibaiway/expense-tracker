import { db } from "../db/database"

export const getProjectsFromUser = async (userId: string) => {
  const projects = await db
    .selectFrom("project_members")
    .where("project_members.userId", "=", userId)
    .innerJoin("project", "project.id", "project_members.projectId")
    .select([
      "project.id",
      "project.name",
      "project.baseCurrency",
      "project_members.role",
    ])
    .execute()
  return projects
}

export const addProjectAndAddMember = async (
  userId: string,
  name: string,
  baseCurrency: string
) => {
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
        userId: userId,
        role: "admin",
      })
      .returning(["projectId", "userId", "role"])
      .executeTakeFirstOrThrow()
  })

  return project
}
