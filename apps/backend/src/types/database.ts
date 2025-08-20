import { ColumnType, Generated, Updateable } from "kysely"

export interface Database {
  project: ProjectTable
  project_members: ProjectMembersTable
  expense: ExpenseTable
}

export interface ProjectTable {
  id: Generated<string>
  name: string
  baseCurrency: string
  totalSum: Generated<number>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface ProjectMembersTable {
  projectId: string
  userId: string
  role: "member" | "admin"
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface ExpenseTable {
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

export type ExpenseUpdate = Updateable<ExpenseTable>
