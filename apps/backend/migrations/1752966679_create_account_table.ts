import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "account" (
            "id" text NOT NULL PRIMARY KEY, 
            "account_id" text NOT NULL, 
            "provider_id" text NOT NULL, 
            "user_id" text NOT NULL REFERENCES "user" ("id"), 
            "access_token" text, 
            "refresh_token" text, 
            "id_token" text, 
            "access_token_expires_at" timestamp, 
            "refresh_token_expires_at" timestamp, 
            "scope" text, 
            "password" text, 
            "created_at" timestamp NOT NULL, 
            "updated_at" timestamp NOT NULL
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "account"`.execute(db)
}
