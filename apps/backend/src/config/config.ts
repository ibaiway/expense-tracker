import { z } from "zod"
import { merge } from "es-toolkit"
import { DeepPartial } from "../utils/deep-partial"
import { Config, ConfigSchema } from "../utils/schemas/config"

process.loadEnvFile()

// Base config
const baseConfig: DeepPartial<Config> = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    maxConnections: 10,
  },
  auth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  env: "development",
}

// Production config overrides
const productionConfig: DeepPartial<Config> = {
  server: {
    host: "0.0.0.0", // Allow external connections
    port: process.env.PORT,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    maxConnections: 20, // Higher connections for production
  },
  auth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  env: "production",
}

// Test config overrides
const testConfig: DeepPartial<Config> = {
  database: {
    host: "localhost",
    port: 5432,
    username: "testuser",
    password: "testpassword", // Default Docker postgres password
    name: "testdb", // Separate test database
    maxConnections: 5, // Lower connections for tests
  },
  // Auth configuration
  auth: {
    secret: "test-secret-key-for-testing-only",
    url: "http://localhost:3002",
  },

  // CORS configuration
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  env: "test",
}

const supportedEnvironments = ["development", "production", "test"] as const

export type Environment = (typeof supportedEnvironments)[number]

const environmentConfigs: Record<Environment, DeepPartial<Config>> = {
  development: baseConfig,
  production: productionConfig,
  test: testConfig,
}

const getAppEnvironment = () => {
  const appEnv = process.env.APP_ENV
  if (appEnv && supportedEnvironments.includes(appEnv as Environment)) {
    return appEnv as Environment
  }
  throw new Error(
    `Expected 'APP_ENV' variable to be one of ${supportedEnvironments.join(
      ", "
    )}, received ${appEnv}`
  )
}

const getConfig = () => {
  const appEnv = getAppEnvironment()
  return getConfigForEnv(appEnv)
}

const getConfigForEnv = (appEnv: Environment) => {
  return ConfigSchema.parse(merge(baseConfig, environmentConfigs[appEnv]))
}

export const config = getConfig()
