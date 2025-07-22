import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL,
  database: new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME || "testuser",
    password: process.env.DATABASE_PASSWORD || "testpassword",
    database: process.env.DATABASE_NAME || "testdb",
  }),
  emailAndPassword: {
    enabled: true,
  },
})
