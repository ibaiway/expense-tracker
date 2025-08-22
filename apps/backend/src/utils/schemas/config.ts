import { z } from "zod"

export const ConfigSchema = z.object({
  // Server configuration
  server: z.object({
    port: z.coerce.number(),
    host: z.string(),
  }),

  // Database configuration
  database: z.object({
    host: z.string(),
    port: z.coerce.number(),
    username: z.string(),
    password: z.string(),
    name: z.string(),
    maxConnections: z.number(),
  }),

  // Auth configuration
  auth: z.object({
    secret: z.string(),
    url: z.string(),
  }),

  // CORS configuration
  cors: z.object({
    origin: z.string(),
    credentials: z.boolean(),
  }),

  // Environment
  env: z.enum(["development", "production", "test"]),
})

// Export the config type
export type Config = z.input<typeof ConfigSchema>
