import { Generated } from "kysely"

export interface Database {
  project: ProjectTable
  project_members: ProjectMembersTable
}

interface ProjectTable {
  id: Generated<string>
  name: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

interface ProjectMembersTable {
  projectId: string
  userId: string
  role: "member" | "admin"
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}
