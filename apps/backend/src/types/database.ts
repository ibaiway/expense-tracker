import { ColumnType, Generated } from "kysely"

export interface Database {
  project: ProjectTable
  project_members: ProjectMembersTable
  expense: ExpenseTable
}

interface ProjectTable {
  id: Generated<string>
  name: string
  baseCurrency: string
  totalSum: Generated<number>
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

interface ExpenseTable {
  id: Generated<string>
  title: string
  projectId: string
  originalCurrency: string
  originalAmount: number
  convertedAmount: number
  exchangeRate: number
  date: ColumnType<Date, string>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}
