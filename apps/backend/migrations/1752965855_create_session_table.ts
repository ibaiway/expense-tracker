import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "session" (
            "id" text NOT NULL PRIMARY KEY, 
            "expiresAt" timestamp NOT NULL, 
            "token" text NOT NULL UNIQUE, 
            "createdAt" timestamp NOT NULL, 
            "updatedAt" timestamp NOT NULL, 
            "ipAddress" text, 
            "userAgent" text, 
            "userId" text NOT NULL REFERENCES "user" ("id")
        );
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "session"`.execute(db)
}
