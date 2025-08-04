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
