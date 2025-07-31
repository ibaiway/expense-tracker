import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "session" (
            "id" text NOT NULL PRIMARY KEY, 
            "expires_at" timestamp NOT NULL, 
            "token" text NOT NULL UNIQUE, 
            "created_at" timestamp NOT NULL, 
            "updated_at" timestamp NOT NULL, 
            "ip_address" text, 
            "user_agent" text, 
            "user_id" text NOT NULL REFERENCES "user" ("id")
        );
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "session"`.execute(db)
}
