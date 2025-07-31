import { CamelCasePlugin, Generated, Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import {
  ExpenseTable,
  ProjectMembersTable,
  ProjectTable,
} from "../../../src/types/database"

interface TestDatabase {
  user: UserTable
  account: AccountTable
  session: SessionTable
  verification: VerificationTable
  project: ProjectTable
  project_members: ProjectMembersTable
  expense: ExpenseTable
}

interface UserTable {
  id: Generated<string>
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

interface AccountTable {
  id: Generated<string>
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Date | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

interface SessionTable {
  id: Generated<string>
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

interface VerificationTable {
  id: Generated<string>
  identifier: string
  value: string
  expiresAt: Date
  createdAt: Date | null
  updatedAt: Date | null
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "testdb",
    host: "localhost",
    user: "testuser",
    password: "testpassword",
    port: 5432,
  }),
})

export const testDb = new Kysely<TestDatabase>({
  dialect,
  plugins: [new CamelCasePlugin()],
})

export async function cleanupDb() {
  await testDb.deleteFrom("account").execute()
  await testDb.deleteFrom("session").execute()
  await testDb.deleteFrom("user").execute()
  await testDb.deleteFrom("verification").execute()
  await testDb.deleteFrom("project_members").execute()
  await testDb.deleteFrom("expense").execute()
  await testDb.deleteFrom("project").execute()
}
