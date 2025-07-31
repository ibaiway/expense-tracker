import { Kysely, sql } from "kysely"

//Table required for better-auth

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "user" (
            "id" text NOT NULL PRIMARY KEY,
            "name" text NOT NULL, 
            "email" text NOT NULL UNIQUE,
            "email_verified" boolean NOT NULL, 
            "image" text,
            "created_at" timestamp NOT NULL, 
            "updated_at" timestamp NOT NULL
        );
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "user"`.execute(db)
}
