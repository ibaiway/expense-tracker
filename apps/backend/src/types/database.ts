import { Generated } from "kysely"

export interface Database {
  project: ProjectTable
}

interface ProjectTable {
  id: Generated<string>
  name: string
  createdBy: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}
