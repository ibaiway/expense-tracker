import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "account" (
            "id" text NOT NULL PRIMARY KEY, 
            "accountId" text NOT NULL, 
            "providerId" text NOT NULL, 
            "userId" text NOT NULL REFERENCES "user" ("id"), 
            "accessToken" text, 
            "refreshToken" text, 
            "idToken" text, 
            "accessTokenExpiresAt" timestamp, 
            "refreshTokenExpiresAt" timestamp, 
            "scope" text, 
            "password" text, 
            "createdAt" timestamp NOT NULL, 
            "updatedAt" timestamp NOT NULL
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "account"`.execute(db)
}
