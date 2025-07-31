import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "verification" (
            "id" text NOT NULL PRIMARY KEY,
            "identifier" text NOT NULL,
            "value" text NOT NULL,
            "expires_at" timestamp NOT NULL,
            "created_at" timestamp,
            "updated_at" timestamp
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "verification"`.execute(db)
}
