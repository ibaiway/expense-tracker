import { Pool } from "pg"
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely"
import { Database } from "../types/database"
import { config } from "../config/config"

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.database.name,
    host: config.database.host,
    user: config.database.username,
    port: config.database.port,
    password: config.database.password,
    max: config.database.maxConnections,
  }),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
})
